# App Taxi (Case Shopper)

> Desenvolvido por: Leonardo de Sant Ana  
> Versão: 1.0
> Lançamento: 27/11/2024

O App Taxi é um projeto case da empresa shopper, simula um sistema de solicitação de corridas onde o usuário pode inserir seu nome/id, escolher um ponto de origem e um ponto de destino, e estimar uma corrida. 
O resultado é exibido na tela com um mapa e a melhor rota disponivel, além de listar motoristas compatíveis com o trajeto, com base na quilometragem mínima.
Quando o motorista é escolhido, a viagem é salva no banco de dados o que nos leva para um histórico onde podemos filtrar por usuário e motoristas e exibir as corridas.

## Tecnologias utilizadas:
 
#### Frontend
 
 - React 
 - Typescript
 - Tailwindcss
 - Axios
 -  Google Maps Api
 
 Dependências, verificar package.json
 
#### Backend
 - NodeJS
 - Typescript
 - ExpressJS
 - Prisma ORM
 - Axios
 - Google Routes API

#### Banco de dados

 - PostgreSQL

#### Docker
- Toda aplicação foi dockerizada em 3 containers, Frontend exposto na porta 80, backend na porta 8080 e banco de dados na porta 5432 padrão postgres

## Como Executar o Projeto

### Pré-requisitos

-   **Docker** e **Docker Compose** instalados.
-   Arquivo `.env` configurado na raiz do projeto.

### Configuração do `.env`

Certifique-se de adicionar as variáveis necessárias no arquivo `.env`:

GOOGLE_API_KEY=< SUA CHAVE GOOGLE>


### Iniciando o Projeto

1.  Clone este repositório:
    
    `git clone https://github.com/LSantanaa/Case_AppTaxi_Shopper.git`
    	  ` cd  Case_AppTaxi_Shopper  ` 
    
2.  Suba os containers com Docker Compose:
    `docker-compose up` 
    
3.  Acesse as Urls:
    
    -   **Frontend**: [http://localhost:80](http://localhost:80)
    -   **Backend**: [http://localhost:8080](http://localhost:8080)
  

### Atenção

Se precisar salvar um bkp dos dados do banco, crie uma pasta chamada db-data na raiz do projeto, o docker irá utilizar ela como espelhamento dos dados.

Dúvidas e Reports, só abrir uma discussão.