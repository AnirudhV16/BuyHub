FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper and configuration files
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Make Maven wrapper executable
RUN chmod +x mvnw

# Copy source code
COPY src ./src

# Build the application (skip tests for faster build)
RUN ./mvnw clean package -DskipTests

# Expose Hugging Face required port
EXPOSE 7860

# Run the Spring Boot application on port 7860
CMD ["java", "-jar", "target/*.jar", "--server.port=7860"]