# La versión instalada de Node en mi equipo es la versión 20. 
# Para evitar tener que hacer un downgrade utilizaré docker para crear un entorno de desarrollo

FROM node:12.14.1

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli@12.0.0

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
