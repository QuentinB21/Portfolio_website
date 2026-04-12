# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_CV_PDF_URL
ARG VITE_CV_MARKDOWN_URL
ARG VITE_UMAMI_SCRIPT_URL
ARG VITE_UMAMI_WEBSITE_ID

ENV VITE_CV_PDF_URL=$VITE_CV_PDF_URL
ENV VITE_CV_MARKDOWN_URL=$VITE_CV_MARKDOWN_URL
ENV VITE_UMAMI_SCRIPT_URL=$VITE_UMAMI_SCRIPT_URL
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID

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
