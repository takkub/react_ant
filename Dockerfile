FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 80

ENV PORT=80

CMD ["npm", "start"]
