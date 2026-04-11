# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_CV_PDF_URL
ARG VITE_CV_MARKDOWN_URL

ENV VITE_CV_PDF_URL=$VITE_CV_PDF_URL
ENV VITE_CV_MARKDOWN_URL=$VITE_CV_MARKDOWN_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY server ./server

EXPOSE 80
CMD ["node", "server/index.js"]
