# Etapa de construcción
FROM node:18 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración de npm
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración básica de Nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/

# Exponer el puerto en el contenedor
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]