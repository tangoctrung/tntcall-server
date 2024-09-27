# Dựa trên Node.js official image
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package*.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN yarn install

# Copy toàn bộ source code vào container
COPY . .

EXPOSE 8000

# Chạy ứng dụng Node.js
CMD ["node", "index.js"]