# Step 1: Use an official Node runtime environment base image
FROM node:18-alpine AS builder

# Set the operational container workspace
WORKDIR /app

# Copy dependency manifests first for optimized caching layers
COPY package*.json ./

# Install packages fresh directly inside the native clean Linux container layer
RUN npm install

# Copy the rest of the frontend source code files safely
COPY . .

# Explicitly grant executable permissions to the build scripts directory 
# to fix the 'sh: react-scripts: Permission denied' issue cleanly.
RUN chmod -R +x node_modules/.bin

# Bypasses warning blockages and compiles your assets into production static bundles
ENV CI=false
RUN npm run build

# Step 2: Serve the compiled production build using a lightweight Nginx server
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 for Render routing architecture compatibility
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]