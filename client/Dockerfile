FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Install a static file server
RUN npm install -g serve

# Copy the built application
COPY --from=build /app/dist ./dist

EXPOSE 5173

# Health check should point to root, not /health (unless you have a health endpoint)
HEALTHCHECK --interval=30s --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1

# Serve the built static files
CMD ["serve", "-s", "dist", "-l", "5173"]