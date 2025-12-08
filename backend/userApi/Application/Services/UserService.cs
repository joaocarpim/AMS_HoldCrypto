using System.Collections.Generic;
using System.Linq;
using BCrypt.Net;
// IMPORTS CORRETOS:
using UserApi.API.DTOs;
using UserApi.Domain.Entities;
using UserApi.Domain.Interfaces;
using UserApi.Application.Interfaces;

namespace UserApi.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public UserDTO RegisterUser(UserDTO userDto)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Phone = userDto.Phone,
                Address = userDto.Address,
                Password = hashedPassword,
                Photo = userDto.Photo,
                Role = "user" // Segurança: força user comum
            };
            _userRepository.Add(user);

            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone,
                Address = user.Address,
                Password = user.Password,
                Photo = user.Photo
            };
        }

        public UserDTO? GetUserDetails(int id)
        {
            var user = _userRepository.GetById(id);
            return user != null ? new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone,
                Address = user.Address,
                Photo = user.Photo
            } : null;
        }

        public List<UserDTO> GetAllUsers()
        {
            return _userRepository.GetAll().Select(user => new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone,
                Address = user.Address,
                Password = user.Password,
                Photo = user.Photo
            }).ToList();
        }

        public UserDTO? UpdateUser(int id, UserDTO userDto)
        {
            var user = _userRepository.GetById(id);
            if (user == null) return null;

            user.Name = userDto.Name;
            user.Email = userDto.Email;
            user.Phone = userDto.Phone;
            user.Address = userDto.Address;

            if (!string.IsNullOrEmpty(userDto.Photo))
                user.Photo = userDto.Photo;

            if (!string.IsNullOrEmpty(userDto.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            _userRepository.Update(user);

            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone,
                Address = user.Address,
                Password = "", 
                Photo = user.Photo
            };
        }

        public bool DeleteUser(int id)
        {
            var user = _userRepository.GetById(id);
            if (user == null) return false;
            _userRepository.Delete(id);
            return true;
        }

        public UserDTO? ValidateUser(string email, string password)
        {
            var user = _userRepository.GetByEmail(email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
                return null;

            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone,
                Address = user.Address,
                Photo = user.Photo
            };
        }
    }
}