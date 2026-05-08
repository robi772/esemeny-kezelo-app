# Node.js 18 Alpine alapú image - kis méret, gyors build
FROM node:18-alpine

# Munkakönyvtár beállítása
WORKDIR /app

# Csak a package.json másolása, hogy a Docker cache hatékony legyen
COPY package*.json ./

# Csak éles függőségek telepítése
RUN npm install --omit=dev

# Forráskód másolása
COPY src/ ./src/

# Port megnyitása
EXPOSE 3000

# Alkalmazás indítása
CMD ["node", "src/index.js"]
