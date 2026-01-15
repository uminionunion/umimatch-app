FROM node:18-alpine

WORKDIR /app

# Copy both backend and frontend package.json
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install && cd ..
RUN cd frontend && npm install && cd ..

# Copy all source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start backend server
WORKDIR /app/backend
CMD ["npm", "start"]