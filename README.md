# Talker Manager

## Descrição

Este repositório contém a aplicação Talker Manager, construída utilizando Node.js e o framework Express. A aplicação utiliza um banco de dados MySQL para armazenar informações sobre pessoas palestrantes. A única rota que possui conexão real com o banco de dados é a rota GET `/talker/db`.

## Rotas

A seguir estão listadas as rotas disponíveis na aplicação:

### GET /talker

Retorna o status 200 e um array com todas as pessoas palestrantes cadastradas.

### GET /talker/:id

Retorna o status 200 e informações sobre uma pessoa palestrante com base no ID fornecido na rota.

### POST /login

Este endpoint recebe no corpo da requisição os campos `email` e `password` e retorna um token aleatório de 16 caracteres como autenticação.

### POST /talker

Cadastra uma nova pessoa palestrante. O corpo da requisição deve estar no seguinte formato:

```json
{
  "name": "Danielle Santos",
  "age": 56,
  "talk": {
    "watchedAt": "22/10/2019",
    "rate": 5
  }
}
PUT /talker/:id
Edita os dados de uma pessoa palestrante com base no ID fornecido na rota. O corpo da requisição deve estar no seguinte formato:

json
Copy code
{
  "name": "Danielle Santos",
  "age": 56,
  "talk": {
    "watchedAt": "22/10/2019",
    "rate": 5
  }
}
A requisição deve conter o token de autenticação no cabeçalho, no campo Authorization.

DELETE /talker/:id
Remove uma pessoa palestrante com base no ID fornecido na rota.

GET /talker/search
Retorna um array de palestrantes que contenham em seu nome o termo pesquisado. Pode ser utilizado um dos seguintes parâmetros de consulta:

q=searchTerm: Filtra por nome.
rate=rateNumber: Filtra por avaliação.
date=watchedDate: Filtra por data de palestra assistida.
PATCH /talker/rate/:id
Altera a avaliação de uma pessoa palestrante com base no ID fornecido na rota.

GET /talker/db
Retorna um array com todas as pessoas palestrantes cadastradas.

Como executar a aplicação
Para executar a aplicação em seu ambiente local, siga as instruções abaixo:

Certifique-se de ter o Node.js instalado em sua máquina.
Clone este repositório para o seu computador.
Na pasta raiz do repositório, execute o comando npm install para instalar as dependências.
Configure as variáveis de ambiente necessárias para a conexão com o banco de dados MySQL e autenticação, se necessário.
Execute o comando npm start para iniciar o servidor.
Acesse as rotas da aplicação através de um cliente HTTP, como o Postman ou o cURL.
