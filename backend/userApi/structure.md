# Projeto Inicial de exemplo
dotnet new webapi -n userApi

# Estrutura do Projeto

```
/userAPI
    /API
        /Controllers
            UserController.cs
        /DTOs
            UserDTO.cs
        /Configurations
            DependencyInjection.cs
        Program.cs
    /Domain
        /Entities
            User.cs
        /Interfaces
            IUserRepository.cs
    /Infrastructure
        /Data
            UserDbContext.cs
        /Repositories
            UserRepository.cs
        /Migrations
            MigrationsFiles.cs
        /Configurations
            UserFiles.cs
    /Application
        /Services
            UserService.cs
        /Interfaces
            IUserService.cs
        /UseCases
            RegisterUserUseCase.cs
            GetUserDetailsUseCase.cs
```

## Arquitetura do Projeto

A aplicação segue uma arquitetura baseada em camadas e princípios da **Clean Architecture**, organizando-se em:

### 1. **API (Camada de Apresentação)**  
   - Contém os **Controllers**, que expõem endpoints REST.
   - Contém **DTOs**, usados para transportar dados entre camadas sem expor diretamente a entidade do domínio.

### 2. **Domain (Camada de Domínio)**  
   - Define as **entidades** (`User.cs`).
   - Define **interfaces** para repositórios.

### 3. **Infrastructure (Infraestrutura e Persistência)**  
   - Contém o **DbContext**, responsável pela comunicação com o banco de dados.
   - Contém os **repositórios**, responsáveis pelas operações no banco.

### 4. **Application (Regras de Negócio e Casos de Uso)**  
   - Contém a implementação dos **serviços**, que encapsulam regras de negócio.
   - Define **casos de uso**, que representam ações específicas da aplicação.

Isso garante **separação de responsabilidades**, facilitando manutenção e escalabilidade.

## Bibliotecas
 - dotnet add package Swashbuckle.AspNetCore 
 - dotnet add package Microsoft.EntityFrameworkCore
 - dotnet add package Microsoft.EntityFrameworkCore.Sqlite

## Executar
 - donet run