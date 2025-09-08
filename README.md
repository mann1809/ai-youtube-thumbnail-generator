# AI YouTube Thumbnail Generator

A Spring Boot web application that uses Google's Nano Banana AI to generate YouTube thumbnails from uploaded images and video descriptions.

## Features

- AI-powered thumbnail generation using Google Nano Banana model
- Image upload support (JPG, PNG - max 10MB)  
- Custom video descriptions for targeted thumbnails
- Web interface with real-time generation
- One-click download of generated thumbnails

## Technology Stack

- **Backend**: Spring Boot 3.5.5, Java 21
- **Frontend**: HTML5, CSS3, JavaScript
- **AI Integration**: Google Nano Banana API
- **Logging**: SLF4J with Logback
- **Build Tool**: Maven

## Architecture

- RESTful API design with clean separation of concerns
- ThumbnailController for AI generation endpoint
- WebController for serving static UI
- Comprehensive logging and error handling
- Configuration externalized in application.yml

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- Google API key for Nano Banana model

### Configuration

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd generator
   ```

2. **Configure Gemini API**
   
   Update `src/main/resources/application.yml`:
   ```yaml
   gemini:
     api:
       key: YOUR_GEMINI_API_KEY_HERE
       endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent
   ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

5. **Access the application**
   - Web Interface: http://localhost:8080
   - API Endpoint: http://localhost:8080/api/v1/thumbnail

## API Usage

### Generate Thumbnail

**Endpoint**: `POST /api/v1/thumbnail`

**Parameters**:
- `file` (multipart): Image file (JPG, PNG, etc. - max 10MB)
- `title` (string): Video description to guide thumbnail generation

**Example**:
```bash
curl -X POST http://localhost:8080/api/v1/thumbnail \
  -F "file=@your-image.jpg" \
  -F "title=Amazing cooking tutorial with secret ingredients"
```

**Response**: Binary image data (PNG format)

## Configuration Options

### Application Settings

```yaml
server:
  port: 8080                    # Server port

spring:
  servlet:
    multipart:
      max-file-size: 10MB       # Maximum upload file size
      max-request-size: 10MB    # Maximum request size

logging:
  level:
    com.thumbnail.generator: DEBUG  # Application log level
```

## Web Interface

The application includes a beautiful web interface featuring:

- 🌸 Cherry blossom theme with pink gradients
- ✨ Animated falling petals background
- 📤 Drag & drop file upload
- 🎯 Real-time thumbnail generation
- 💾 One-click download

## Development

### Running in Development Mode

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Building for Production

```bash
mvn clean package -DskipTests
java -jar target/generator-0.0.1-SNAPSHOT.jar
```
