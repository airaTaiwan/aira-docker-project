FROM node:18-alpine
WORKDIR /app
ADD package.json package.json
RUN npm install --omit=dev
ADD bundle.js bundle.js
CMD ["./bundle.js"]