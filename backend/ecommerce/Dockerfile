# ---------- Build stage ----------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn -q -e -DskipTests clean package

# ---------- Run stage ----------
FROM eclipse-temurin:21-jdk
WORKDIR /app
# Copy the fat JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Hugging Face Spaces (Docker SDK) will route traffic to this port.
# We'll set this in README.yaml too, but EXPOSE is nice for clarity.
EXPOSE 8081

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
