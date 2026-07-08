FROM node:22-alpine

WORKDIR /workspace

COPY package*.json ./
COPY apps/api/package*.json apps/api/
COPY packages/shared/package*.json packages/shared/
COPY packages/config/package*.json packages/config/
RUN npm install

COPY . .
RUN npm run prisma:generate -w @mikyasos/api

EXPOSE 3000
CMD ["npm", "run", "start:dev", "-w", "@mikyasos/api"]
