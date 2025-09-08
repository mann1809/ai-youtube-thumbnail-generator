package com.thumbnail.generator.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thumbnail.generator.dto.NanoBananaResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ThumbnailController {

    private static final Logger logger = LoggerFactory.getLogger(ThumbnailController.class);

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.endpoint}")
    private String geminiApiEndpoint;

    @PostMapping("/thumbnail")
    public ResponseEntity<?> generateThumbnail(@RequestParam MultipartFile file, @RequestParam String title) {
        logger.info("Received thumbnail generation request - File: {}, Size: {} bytes, Title: {}", 
                   file.getOriginalFilename(), file.getSize(), title);
        
        String prompt = "Create a bold, viral YouTube thumbnail in 16:9 widescreen landscape format. " +
                "Make it high-contrast, vibrant, and attention-grabbing. " +
                "Emphasize facial expressions, emotions, or the main subject from the given image. " +
                "Add dramatic lighting and exaggerated colors to make it pop. Ensure the composition clearly highlights the main theme: %s. " +
                "The thumbnail should look professional, clickable, and optimized for YouTube, evoking curiosity and excitement. " +
                "Use aesthetic, bold fonts and vibrant colors for the text. " +
                "Do not include the YouTube logo. Final output must strictly be in 16:9 landscape aspect ratio.";
        
        try {
            logger.debug("Converting file to base64 encoding");
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());

            logger.debug("Building payload for Gemini API");
            Map<String, Object> payload = Map.of(
                    "contents", new Object[]{
                            Map.of("parts", new Object[]{
                                    Map.of("text", String.format(prompt, title)),
                                    Map.of("inline_data", Map.of(
                                            "mime_type", file.getContentType(),
                                            "data", base64
                                    ))
                            })
                    }
            );
            
            logger.debug("Preparing REST request to Gemini API endpoint: {}", geminiApiEndpoint);
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            logger.info("Calling Gemini API for thumbnail generation");
            ResponseEntity<String> response = restTemplate.exchange(geminiApiEndpoint, HttpMethod.POST, entity, String.class);
            String image = response.getBody();
            
            logger.debug("Received response from Gemini API, parsing response");
            ObjectMapper mapper = new ObjectMapper();
            NanoBananaResponse bananaResponse = mapper.readValue(image, NanoBananaResponse.class);
            String base64Data = bananaResponse
                    .getCandidates().getFirst()
                    .getContent().getParts()
                    .stream()
                    .filter(part -> part.getInlineData() != null)
                    .findFirst()
                    .get()
                    .getInlineData().getData();

            logger.debug("Decoding base64 image data");
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);
            
            logger.info("Successfully generated thumbnail - Size: {} bytes", imageBytes.length);
            return new ResponseEntity<>(imageBytes, HttpStatus.OK);
            
        } catch (IOException e) {
            logger.error("Failed to process file upload or API response", e);
            return new ResponseEntity<>("Failed to generate thumbnail: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            logger.error("Unexpected error during thumbnail generation", e);
            return new ResponseEntity<>("Unexpected error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}