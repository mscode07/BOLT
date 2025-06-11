
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package.json ./package.json

COPY --from=build /app/dist ./dist

RUN npm install --only=production --frozen-lockfile

EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost:5173/health || exit 1

CMD ["npm", "start"]