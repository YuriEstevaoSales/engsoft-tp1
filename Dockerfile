FROM node:22-bookworm-slim

ARG API_PORT=3002

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .

EXPOSE 5173 ${API_PORT}

CMD ["npm", "run", "dev"]
