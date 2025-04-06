# _CareBridge Mobile_ - The New Healthcare App at your Fingertips

Welcome to **_CareBridge Mobile_**, a mobile healthcare communication app designed to help you understand and interpret medical documents and notes from healthcare providers. This app builds on the previous web based application and delivers the same functionality with mobile first approach and focus.

You can view the live demo of **_CareBridge Mobile_** by clicking [this link](https://youtube.com/shorts/vL0RapFc1PM?feature=share)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Dependencies](#dependencies)
- [Running Locally](#running-the-application-locally)

## Overview

CareBridge is now redesigned with a mobile-first approach to improve accessibility and usability for a wider audience. This update ensures optimal performance on mobile devices, addressing the technological landscape where mobile usage is dominant.

## Features

With CareBridge, you can easily interpret medical jargon and understand your health with a range of features:

- **Mobile Optimization**: Responsive design, touch-friendly navigation, and intuitive interfaces for seamless use on smartphones.

- **Document Upload**: Securely upload your doctor's notes or medical documents for interpretation.

- **Document Interpretation**: Get clear, plain-language explanations of medical information.

- **Text Extraction**: Extract and analyze text from uploaded medical documents.

- **Text-to-Speech**: Listen to translated medical explanations, making the app more accessible for users with visual impairments or low literacy.

- **Mobile-Native Integrations**: Use your phone’s camera to upload doctor’s notes easily.

- **Sharing & Saving**: Save medical information to your device or share it via email and messaging apps.

## Dependencies

CareBridge Mobile uses these main packages:

- `react-native`: Core framework for building native apps using React.
- `expo`: Development platform for making universal native apps for Android, iOS, and the web.
- `expo-image-picker`: Provides access to the system's UI for selecting images from the device's library or camera.
- `aws-sdk`: Provides programmatic access to AWS services.

## Running the Application Locally

### Local Installation and Setup

1. To set up CareBridge Mobile locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/andreialbu03/CareBridge-Mobile
cd CareBridge-Mobile

# Install dependencies
npm install
```

2. Create a `.env` file in the project root directory.
3. Make sure the following environment variables are present in the `.env` file:

```
AWS_REGION=aws-region
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=your-aws-s3-bucket-name
OPENAI_API_KEY=your-openai-api-key
```

### Running the Application

4. Start the Expo development server:

```bash
npm start
```

5. To run on iOS Simulator:

   - Press `i` in the terminal to open in iOS Simulator
   - OR scan the QR code with your iPhone camera and open in Expo Go app

6. To run on Android Emulator:
   - Press `a` in the terminal to open in Android Emulator
   - OR scan the QR code with the Expo Go app on your Android device
