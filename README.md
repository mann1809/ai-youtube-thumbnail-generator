# AI YouTube Thumbnail Generator

A Spring Boot web application that leverages Google's Nano Banana AI to generate eye-catching YouTube thumbnails from uploaded images and video descriptions.

## Project Overview

This application transforms ordinary images into viral-ready YouTube thumbnails using AI. Users upload an image and provide a video description, then the system uses Google's Nano Banana model to create professional, attention-grabbing thumbnails optimized for YouTube's platform.

## Technology Stack

- **Backend**: Spring Boot 3.5.5 with Java 21
- **AI Integration**: Google Nano Banana Image Preview API
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## Features

- **AI-Powered Generation**: Uses Google Nano Banana for intelligent thumbnail creation
- **Image Upload**: Supports common image formats (JPG, PNG) up to 10MB
- **Responsive Web Interface**: Clean, modern UI with real-time preview
- **Download Functionality**: One-click download of generated thumbnails

## Setup and Configuration

### Prerequisites

- Java 21 or higher
- Maven 3.6+ 
- Google Cloud account with Gemini API access

### Configuration Steps

1. **Get Google Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key for Gemini

2. **Configure API Key**
   
   Update `src/main/resources/application.yml`:
   ```yaml
   gemini:
     api:
       key: YOUR_ACTUAL_GEMINI_API_KEY_HERE
       endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent
   ```

3. **Build the Application**
   ```bash
   mvn clean compile
   ```

## How to Run

### Development Mode
```bash
mvn spring-boot:run
```

### Production Build
```bash
mvn clean package
java -jar target/generator-0.0.1-SNAPSHOT.jar
```

### Docker Deployment
```bash
# Build the application
mvn clean package

# Build Docker image
docker build -t ai-thumbnail-generator .

# Run container
docker run -p 8080:8080 ai-thumbnail-generator
```

### Access the Application
- **Web Interface**: http://localhost:8080

## API Documentation

### Generate Thumbnail Endpoint

**URL**: `POST /api/v1/thumbnail`

**Content-Type**: `multipart/form-data`

**Parameters**:
- `file` (required): Image file (max 10MB, supports common formats)
- `title` (required): Video description/title for context

**Response**: Binary image data (PNG format)

**Example Usage**:
```bash
curl -X POST http://localhost:8080/api/v1/thumbnail \
  -F "file=@my-image.jpg" \
  -F "title=Amazing Travel Vlog - Best Destinations 2024"
```
