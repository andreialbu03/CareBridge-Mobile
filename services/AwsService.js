// services/AwsService.js
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  TextractClient,
  DetectDocumentTextCommand,
  AnalyzeDocumentCommand,
} from "@aws-sdk/client-textract";

// AWS Configuration - Replace these with your actual values
const awsConfig = {
  region: "YOUR_AWS_REGION", // e.g., 'us-east-1'
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY_ID",
    secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  },
  bucketName: "YOUR_S3_BUCKET_NAME",
};

/**
 * Upload image to S3 and process with Textract
 * @param {string} imageUri - Local URI of the image to upload
 * @returns {Promise<object>} - Textract results
 */
export const processImage = async (imageUri) => {
  try {
    // Step 1: Read the image file
    const imageBase64 = await fileToBase64(imageUri);

    // Step 2: Upload to S3
    const s3Key = await uploadToS3(imageBase64, imageUri);

    // Step 3: Process with Textract
    const textractResults = await analyzeWithTextract(s3Key);

    return textractResults;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

/**
 * Convert a file to Base64
 * @param {string} uri - Local URI of the file
 * @returns {Promise<string>} - Base64 encoded file
 */
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

/**
 * Upload file to S3 bucket
 * @param {string} base64Data - Base64 encoded file data
 * @param {string} uri - Original file URI (used to determine file name and type)
 * @returns {Promise<string>} - S3 object key
 */
const uploadToS3 = async (base64Data, uri) => {
  try {
    // Create S3 client with your credentials
    const s3Client = new S3Client({
      region: awsConfig.region,
      credentials: awsConfig.credentials,
    });

    // Generate a unique file name based on timestamp
    const fileName = uri.split("/").pop();
    const fileExtension = fileName.split(".").pop();
    const timestamp = new Date().getTime();
    const key = `uploads/${timestamp}-${fileName}`;

    // Determine content type based on file extension
    let contentType = "application/octet-stream";
    if (
      fileExtension.toLowerCase() === "jpg" ||
      fileExtension.toLowerCase() === "jpeg"
    ) {
      contentType = "image/jpeg";
    } else if (fileExtension.toLowerCase() === "png") {
      contentType = "image/png";
    } else if (fileExtension.toLowerCase() === "pdf") {
      contentType = "application/pdf";
    }

    // Create buffer from base64 data
    const buffer = Buffer.from(base64Data, "base64");

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    console.log("File uploaded successfully to S3:", key);

    return key;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

/**
 * Analyze document with AWS Textract
 * @param {string} s3Key - S3 object key
 * @returns {Promise<object>} - Textract analysis results
 */
const analyzeWithTextract = async (s3Key) => {
  try {
    // Create Textract client with your credentials
    const textractClient = new TextractClient({
      region: awsConfig.region,
      credentials: awsConfig.credentials,
    });

    // Configure Textract parameters
    const params = {
      Document: {
        S3Object: {
          Bucket: awsConfig.bucketName,
          Name: s3Key,
        },
      },
      FeatureTypes: ["TABLES", "FORMS"], // Include if you want to analyze tables and forms
    };

    // Call Textract to analyze the document
    const command = new AnalyzeDocumentCommand(params);
    const response = await textractClient.send(command);

    console.log("Textract analysis completed successfully");
    return response;
  } catch (error) {
    console.error("Error analyzing with Textract:", error);
    throw error;
  }
};

/**
 * Detect plain text in document with AWS Textract (simpler alternative)
 * @param {string} s3Key - S3 object key
 * @returns {Promise<object>} - Textract text detection results
 */
export const detectTextInDocument = async (s3Key) => {
  try {
    // Create Textract client with your credentials
    const textractClient = new TextractClient({
      region: awsConfig.region,
      credentials: awsConfig.credentials,
    });

    // Configure Textract parameters
    const params = {
      Document: {
        S3Object: {
          Bucket: awsConfig.bucketName,
          Name: s3Key,
        },
      },
    };

    // Call Textract to detect text
    const command = new DetectDocumentTextCommand(params);
    const response = await textractClient.send(command);

    console.log("Textract text detection completed successfully");
    return response;
  } catch (error) {
    console.error("Error detecting text with Textract:", error);
    throw error;
  }
};
