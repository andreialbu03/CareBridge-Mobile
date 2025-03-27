import { uploadData } from "aws-amplify/storage";
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

// Create a direct S3 client
const s3Client = new S3Client({
  region: "ca-central-1", // Your region from the config
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for React Native
});

export const processImage = async (imageUri) => {
  try {
    // Just pass the URI directly to uploadToS3
    const s3Key = await uploadToS3Direct(imageUri);
    const textractResults = await analyzeWithTextract(s3Key);
    const extractedText = extractText(textractResults);
    const explanation = analyzeTextWithOpenAI(extractedText);
    return explanation;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

const fileToBase64 = async (uri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error("File doesn't exist");
    }
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting file to base64:", error);
    throw error;
  }
};

const uploadToS3Direct = async (uri) => {
  try {
    console.log("Uploading file to S3 directly...");
    const fileName = uri.split("/").pop();
    const timestamp = new Date().getTime();
    const key = `uploads/${timestamp}-${fileName}`;

    // Read the file
    let fileContent;
    try {
      fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (readError) {
      console.error("Error reading file:", readError);
      throw readError;
    }

    // Create buffer from base64
    const buffer = Buffer.from(fileContent, "base64");

    // Upload directly using AWS SDK
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

// const uploadToS3 = async (base64Data, uri) => {
//   try {
//     console.log("Uploading file to S3...");
//     const fileName = uri.split("/").pop();
//     const timestamp = new Date().getTime();
//     const key = `uploads/${timestamp}-${fileName}`;

//     // Use the file URI directly for local files
//     if (uri.startsWith("file://") || uri.startsWith("content://")) {
//       // For local files, we can use the file URI directly
//       const result = await uploadData({
//         key: key,
//         data: uri,
//         options: {
//           contentType: "image/jpeg", // or 'image/png' based on your file type
//           useAccelerateEndpoint: true, // Optional: can speed up uploads
//         },
//       }).result;

//       console.log("File uploaded successfully to S3:", key);
//       return key;
//     } else {
//       // For base64 data, we need a different approach
//       // Create a temporary file from the base64 data
//       const tempFilePath = FileSystem.cacheDirectory + fileName;
//       await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       // Upload the temporary file
//       const result = await uploadData({
//         key: key,
//         data: tempFilePath,
//         options: {
//           contentType: "image/jpeg",
//           useAccelerateEndpoint: true,
//         },
//       }).result;

//       // Clean up the temporary file
//       await FileSystem.deleteAsync(tempFilePath, { idempotent: true });

//       console.log("File uploaded successfully to S3:", key);
//       return key;
//     }
//   } catch (error) {
//     console.error("Error uploading to S3:", error);
//     throw error;
//   }
// };

const analyzeWithTextract = async (s3Key) => {
  try {
    console.log("Analyzing document with Textract...");
    const textractClient = new TextractClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    // Use the bucket name from your amplify config
    const params = {
      Document: {
        S3Object: {
          Bucket: S3_BUCKET_NAME, // Using the bucket name from your config
          Name: s3Key,
        },
      },
      FeatureTypes: ["TABLES", "FORMS"],
    };

    const command = new AnalyzeDocumentCommand(params);
    const response = await textractClient.send(command);

    console.log("Textract analysis completed successfully");
    return response;
  } catch (error) {
    console.error("Error analyzing with Textract:", error);
    throw error;
  }
};

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

const analyzeTextWithOpenAI = async (extractedText) => {
  try {
    console.log("Analyzing text with OpenAI...");
    console.log("Extracted text in ai:", extractedText);
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
