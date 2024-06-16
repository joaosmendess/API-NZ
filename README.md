# NZ-Depoimento Backend

Uma mini documentação sobre o backend do NZ

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Mongoose**
- **TypeScript**
- **MongoDB**
- **Docker**

## Estrutura do Projeto

```plaintext
nz-depoimento/
├── src/
│ ├── controllers/
│ │ └── depoimentoController.ts
│ ├── models/
│ │ └── Depoimento.ts
│ ├── routes/
│ │ └── depoimentoRoutes.ts
│ ├── middleware/
│ ├── app.ts
│ └── index.ts
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── .env
```
## Endpoints

### Listar Depoimentos

- **URL:** `/depoimentos`
- **Método:** `GET`
- **Descrição:** Lista todos os depoimentos.

### Obter Depoimento por ID

- **URL:** `/depoimentos/:id`
- **Método:** `GET`
- **Descrição:** Obtém um depoimento pelo ID.

### Criar Depoimento

- **URL:** `/depoimentos`
- **Método:** `POST`
- **Descrição:** Cria um novo depoimento.
- **Dados do Corpo:**
  ```json
  {
    "nome": "Nome do Usuário",
    "email": "email@example.com",
    "telefone": "123456789",
    "texto": "Texto do depoimento",
    "videoUrl": "URL do vídeo",
    "fotoUrl": "URL da foto"
  }
  ```
## Configuração e Execução

### Pré-requisitos
Docker e Docker Compose instalados.
### Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
```
PORT=3000
MONGODB_URI=mongodb://root:example@mongo:27017/nz-depoimento?authSource=admin
```
### Instruções para Execução com Docker
 
 1. Clone o repósitorio:
 ```plaintext
 git clone <URL_DO_REPOSITORIO>
cd nz-depoimento
```
 2. Construa e inicie os containers:
 ```plaintext
docker-compose up --build

```
 3. Acesse a aplicação:
   Abra seu navegador e vá para http://localhost:3001/depoimentos.

