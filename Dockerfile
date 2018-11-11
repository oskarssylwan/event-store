FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
copy .default.env .env
EXPOSE 3000 3001
CMD ["npm", "start"]
