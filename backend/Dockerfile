FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port (assuming standard 5000 or 3000, will map in compose)
EXPOSE 5000

# Start server and automatically push schema to database
CMD ["sh", "-c", "npx prisma db push && npm start"]
