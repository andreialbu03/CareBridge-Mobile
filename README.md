# _CareBridge Mobile_ - The New Healthcare App at your Fingertips

Welcome to **_CareBridge Mobile_**, a mobile healthcare communication app designed to help you understand and interpret medical documents and notes from healthcare providers. This app builds on the previous web based application and delivers the same functionality with mobile first approach and focus.

You can access **_CareBridge_** by clicking [this link](http://15.156.201.68:8000)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Running Locally](#running-the-application-locally)
- [Dependencies](#dependencies)

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

CareBridge uses the following packages:

- `fastapi`: A modern, fast (high-performance) web framework for building APIs with Python.
- `uvicorn`: An ASGI server implementation, for running the application.
- `jinja2`: A template engine for Python.
- `python-multipart`: A streaming multipart parser for Python.
- `boto3`: The Amazon Web Services (AWS) SDK for Python.
- `python-dotenv`: Reads key-value pairs from a `.env` file and sets them as environment variables.
- `openai`: The official OpenAI API client for Python.

## Running the Application Locally

### Local Installation and Setup

1. To set up CareBridge locally, follow these steps:

```bash
# Clone the repository
git clone https://your-repository-link.git
cd CareBridge

# Optional: Set up a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use 'venv\Scripts\activate'

# Install dependencies
pip install -r requirements.txt
```

2. Create a `.env` file in the project root directory.

3. Makes sure the following environment variables are present in the `.env` file:

```
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET=your_s3_bucket_name
GPT_API_KEY=your_gpt_api_key
```

### Running the Application

3. Run the application using UVicorn within the `src` directory:

```bash
cd src
uvicorn main:app --reload
```
