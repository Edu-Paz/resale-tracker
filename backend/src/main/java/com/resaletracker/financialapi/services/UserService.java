package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.UserDTO;
import com.resaletracker.financialapi.dtos.UserRegisterDTO;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return new UserDTO(user.getId(), user.getUsername(), user.getBalance());
    }

    @Transactional
    public UserDTO registerUser(UserRegisterDTO userRegisterDTO) {
        if (!userRegisterDTO.getPassword().equals(userRegisterDTO.getPasswordConfirmation())) {
            throw new IllegalArgumentException("Password do not match");
        }
        if (userRepository.existsByUsername(userRegisterDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(userRegisterDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));
        user.setBalance(BigDecimal.ZERO);

        userRepository.save(user);
        return new UserDTO(user.getId(), user.getUsername(), user.getBalance());
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            // Lança uma exceção se o usuário a ser deletado não existir.
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

}
