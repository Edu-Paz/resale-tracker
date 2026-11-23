# ---------------- ESTÁGIO DE BUILD ----------------
# Imagem do Maven com JDK 25 (compatível com o java.source/target do pom.xml)
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

# Copia o wrapper e o pom primeiro para aproveitar cache de dependências
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

# Baixa as dependências sem compilar o código ainda
RUN mvn dependency:go-offline -B

# Copia o código-fonte e compila o JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------------- ESTÁGIO DE EXECUÇÃO ----------------
# JRE leve apenas para rodar o JAR
FROM eclipse-temurin:25-jre

WORKDIR /app

# Cria usuário não-root por segurança
RUN addgroup --system app && adduser --system --ingroup app app

# Copia o JAR gerado no estágio de build
COPY --from=build /app/target/*.jar app.jar

# Usuário não-root
USER app

# Porta padrão do Spring Boot
EXPOSE 8080

# Profile de produção é definido via env var (Render). Default = prod
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
