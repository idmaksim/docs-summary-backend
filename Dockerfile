FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]