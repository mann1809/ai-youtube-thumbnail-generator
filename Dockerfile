FROM openjdk:21

COPY /target/generator-0.0.1-SNAPSHOT.jar ai-thumbnail-generator.jar

EXPOSE 8080

CMD ["java","-jar","ai-thumbnail-generator.jar"]