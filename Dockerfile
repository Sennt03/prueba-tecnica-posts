# Base: OpenJDK para backend Java
FROM openjdk:24-jdk-slim

# Instalar Node.js, npm y Angular CLI
RUN apt-get update && \
    apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g @angular/cli concurrently && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar backend
COPY backend/prueba.jar ./backend/app.jar

# Copiar frontend
COPY frontend ./frontend

# Instalar dependencias frontend
RUN cd frontend && npm install

# Exponer puertos
EXPOSE 8080 4201 4202 4203

# Comando por defecto: ejecutar backend + frontend en paralelo
CMD concurrently \
  "java -jar ./backend/app.jar" \
  "cd frontend && ng serve --port 4201 --host 0.0.0.0" \
  "cd frontend && ng serve --configuration=en --port 4202 --host 0.0.0.0" \
  "cd frontend && ng serve --configuration=fr --port 4203 --host 0.0.0.0"
