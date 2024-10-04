FROM node:20-alpine
RUN apk update \
    && apk add --no-cache \
    chromium \
    nss \
    freetype \
    ttf-freefont \
    harfbuzz \
    ca-certificates \
    libx11 \
    libxcomposite \
    libxdamage \
    libxrandr \
    libxtst \
    libxshmfence \
    mesa-gl \
    udev \
    && apk add --no-cache --virtual .build-deps \
    python3 \
    g++ \
    make \
    && npm install -g npm@latest \
    && npm install -g ts-node typescript  # <-- Ensure ts-node and TypeScript are installed globally

WORKDIR /app

COPY /add_people /app/add_people
COPY package*.json /app/
COPY bot /app/bot

RUN npm install \
    whatsapp-web.js \
    qrcode-terminal \
    @types/qrcode-terminal \
    mysql2 \
    openai \
    puppeteer-core 

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

ENV PUPPETEER_SKIP_DOWNLOAD=true

CMD ["ts-node", "bot/main.ts"]
