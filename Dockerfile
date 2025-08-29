# Step 1: Start with Node.js (like getting ingredients)
FROM node:18-alpine AS build

# Step 2: Create a workspace
WORKDIR /app

# Step 3: Copy package.json (shopping list)
COPY package*.json ./

# Step 4: Install dependencies (buy ingredients)
RUN npm ci --silent

# Step 5: Copy your code
COPY . .

# Step 6: Build your React app
RUN npm run build

# Step 7: Use Nginx to serve the app (like a waiter serving food)
FROM nginx:alpine

# Step 8: Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Step 9: Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Step 10: Tell Docker which port to use
EXPOSE 80

# Step 11: Start nginx
CMD ["nginx", "-g", "daemon off;"]