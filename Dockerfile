FROM node:18-slim as builder
WORKDIR /app
COPY . .
RUN npm install --quit
RUN npm run build

FROM nginx:1.22-alpine
WORKDIR /app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/smart-mirror /usr/share/nginx/html
COPY --from=builder /app/src/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]