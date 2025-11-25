FROM node:24-alpine3.21

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install -g typescript

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]