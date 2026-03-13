# ─────────────────────────────────────────────────────────────────
#  STAGE 1 — BUILD  (Node 20 + Vite)
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Cache node_modules layer — only re-installs when package files change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Backend URL injected at build time
# docker build --build-arg VITE_API_URL=https://api.zulugshop.onrender.com .
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build        # outputs to /app/dist

# ─────────────────────────────────────────────────────────────────
#  STAGE 2 — SERVE  (Nginx serving static dist)
# ─────────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime

RUN rm /etc/nginx/conf.d/default.conf

# Custom Nginx config — handles React Router fallback + caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
