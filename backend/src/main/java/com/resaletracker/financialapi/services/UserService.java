package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.UserDTO;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDTO findById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null; // Or throw a custom exception like UserNotFoundException
        }
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setBalance(user.getBalance());
        return userDTO;
    }

}
