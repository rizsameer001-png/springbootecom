# ─────────────────────────────────────────────────────────────────
#  STAGE 1 — BUILD  (Maven + JDK 21)
# ─────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Cache dependency layer — only re-downloads when pom.xml changes
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Build fat JAR
COPY src src
RUN ./mvnw clean package -DskipTests -B

# ─────────────────────────────────────────────────────────────────
#  STAGE 2 — RUNTIME  (slim JRE, no build tools)
# ─────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

# Run as non-root for security
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
RUN chown spring:spring app.jar
USER spring

EXPOSE 8080

# Container-aware JVM flags:
#   UseContainerSupport   -> respect cgroup memory limits
#   MaxRAMPercentage=75   -> heap = 75% of container RAM
#   urandom               -> fast startup (no /dev/random blocking)
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
