FROM node:20-alpine

WORKDIR /app

COPY package.json ./

# Χρησιμοποιούμε --legacy-peer-deps για μηδενικά conflicts στο οικοσύστημα του R3F
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]