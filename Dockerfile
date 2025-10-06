# Etapa 1: Build da aplicação Angular
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir com NGINX
FROM nginx:alpine

# Remove o default.conf do NGINX
RUN rm /etc/nginx/conf.d/default.conf


# Copia o arquivo de configuração customizado do NGINX
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos buildados do Angular para o diretório público do NGINX
COPY --from=build /app/dist/cashflow/browser/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]