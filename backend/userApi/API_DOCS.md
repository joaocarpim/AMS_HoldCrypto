# Especificação Técnica - User API

**Base URL:** `http://localhost:5294`

## Endpoints

### 1. Autenticação
- **POST** `/api/auth/login`: Autentica usuário e retorna JWT.
- **GET** `/api/auth/profile`: Retorna dados do usuário logado (Requer Token).

### 2. Usuários
- **POST** `/api/user`: Registro de novo usuário.
- **PUT** `/api/user/{id}`: Atualização de dados.
- **DELETE** `/api/user/{id}`: Remoção de conta.