# 👤 User API

Microserviço responsável pelo ciclo de vida dos usuários, autenticação e segurança.

## 🚀 Tecnologias
- .NET 9
- JWT Bearer Authentication
- BCrypt (Hash de senhas)
- SQLite

## 👑 Configuração de Administrador

Por segurança, a API não expõe endpoint para criação de admins via HTTP.
Para promover um usuário a `admin`, utilize um acesso direto ao banco (`userdb.sqlite`) via DB Browser:
`UPDATE Users SET Role = 'admin' WHERE Email = 'seu@email.com';`

## ⚙️ Como Rodar
```bash
dotnet restore
dotnet run
# Porta: http://localhost:5294