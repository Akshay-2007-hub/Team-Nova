# Stage 1: Build the frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend and serve
FROM python:3.10-slim
WORKDIR /app

# No apt-get needed for opencv-python-headless

# Copy backend requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy frontend build from stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (Railway sets PORT environment variable)
ENV PORT=8000
EXPOSE $PORT

# Start the application
WORKDIR /app/backend
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
