import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import {
  TextractClient,
  AnalyzeDocumentCommand,
} from "@aws-sdk/client-textract";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
  OPENAI_API_KEY,
} from "@env";
import OpenAI from "openai";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { ReadableStream } from "web-streams-polyfill";
globalThis.ReadableStream = ReadableStream;

// Create S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// Create OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for React Native
});

// Process an image using AWS Textract and OpenAI gpt model
export const processImage = async (imageUri) => {
  try {
    const s3Key = await uploadToS3(imageUri);
    const textractResults = await analyzeWithTextract(s3Key);
    const extractedText = extractText(textractResults);
    const explanation = analyzeTextWithOpenAI(extractedText);
    return explanation;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

// Upload an image to S3
const uploadToS3 = async (uri) => {
  try {
    console.log("Getting ready to upload to S3...");
    const fileName = uri.split("/").pop();
    const timestamp = new Date().getTime();
    const key = `uploads/${timestamp}-${fileName}`;

    // Read the file
    let fileContent;
    try {
      console.log("Reading file:", uri);
      fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (readError) {
      console.error("Error reading file:", readError);
      throw readError;
    }

    // Create buffer from base64
    const buffer = Buffer.from(fileContent, "base64");

    // Upload to S3
    console.log("Uploading file to S3 directly...");
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    });

    await s3Client.send(command);
    console.log("File uploaded successfully to S3:", key);
    return key;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

// Analyze an image using AWS Textract
const analyzeWithTextract = async (s3Key) => {
  try {
    console.log("Analyzing document with Textract...");

    // Create Textract client
    const textractClient = new TextractClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // Prepare the request
    const params = {
      Document: {
        S3Object: {
          Bucket: S3_BUCKET_NAME,
          Name: s3Key,
        },
      },
      FeatureTypes: ["TABLES", "FORMS"],
    };

    // Analyze the document
    const command = new AnalyzeDocumentCommand(params);
    const response = await textractClient.send(command);

    console.log("Textract analysis completed successfully");
    return response;
  } catch (error) {
    console.error("Error analyzing with Textract:", error);
    throw error;
  }
};

// Extract text from Textract results
const extractText = (results) => {
  if (!results || !results.Blocks) {
    return "No text detected in the document.";
  }

  // Filter for LINE type blocks and sort by position (top to bottom, then left to right)
  const lines = results.Blocks.filter(
    (block) => block.BlockType === "LINE"
  ).sort((a, b) => {
    const aTop = a.Geometry?.BoundingBox?.Top || 0;
    const bTop = b.Geometry?.BoundingBox?.Top || 0;

    // If they're roughly on the same line (within 2% of page height)
    if (Math.abs(aTop - bTop) < 0.02) {
      // Sort by Left position (left to right)
      return (
        (a.Geometry?.BoundingBox?.Left || 0) -
        (b.Geometry?.BoundingBox?.Left || 0)
      );
    }

    // Otherwise sort by Top position (top to bottom)
    return aTop - bTop;
  });

  // Extract and join the text
  return lines.map((line) => line.Text).join("\n");
};

// Analyze text with OpenAI
const analyzeTextWithOpenAI = async (extractedText) => {
  try {
    // Make the OpenAI API call
    console.log("Analyzing text with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that analyzes medical documents.",
        },
        {
          role: "user",
          content: `Analyze this medical document text and provide a clear explanation:

${extractedText}

Provide a comprehensive analysis highlighting key medical information.`,
        },
      ],
      // max_tokens: 300,
    });

    // console.log("OpenAI response:", response.choices[0].message);

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing text with OpenAI:", error);
    throw error;
  }
};
