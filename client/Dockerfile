# Stage 1: Development / Build Base
FROM node:20-alpine as dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Default for dev mode (can be overridden)
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 2: Production Build
FROM dev as build
RUN npm run build

# Stage 3: Production Serve (Nginx)
FROM nginx:alpine as prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
