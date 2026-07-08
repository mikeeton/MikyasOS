FROM node:22-alpine

WORKDIR /workspace

COPY package*.json ./
COPY apps/web/package*.json apps/web/
COPY packages/shared/package*.json packages/shared/
COPY packages/config/package*.json packages/config/
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "-w", "@mikyasos/web"]
