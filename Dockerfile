FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install && cd ..
RUN cd frontend && npm install && cd ..

# Copy all backend files
COPY backend/ ./backend/

# Copy all frontend files (both source and dist)
COPY frontend/ ./frontend/

# Build frontend (copy src to dist)
WORKDIR /app/frontend
RUN npm run build
WORKDIR /app

# Expose port
EXPOSE 3000

# Start backend
CMD ["node", "backend/server.js"]