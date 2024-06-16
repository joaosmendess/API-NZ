# Usa a imagem oficial do Node.js como imagem base
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Expõe a porta em que o servidor irá rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
