FROM node:24-alpine3.21

WORKDIR /app

COPY package.json .

RUN npm i

RUN npm i -g typescript

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]