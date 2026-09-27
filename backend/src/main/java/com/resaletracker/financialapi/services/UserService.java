package com.resaletracker.financialapi.services;

import com.resaletracker.financialapi.dtos.user.UserDTO;
import com.resaletracker.financialapi.dtos.user.FinancialSummaryDTO;
import com.resaletracker.financialapi.dtos.user.UserRegisterDTO;
import com.resaletracker.financialapi.entities.User;
import com.resaletracker.financialapi.repositories.UserRepository;
import com.resaletracker.financialapi.services.exceptions.BusinessException;
import com.resaletracker.financialapi.services.exceptions.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BalanceService balanceService;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            BalanceService balanceService,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.balanceService = balanceService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserDTO(user, balanceService.calculateByUserId(id));
    }

    @Transactional(readOnly = true)
    public FinancialSummaryDTO financialSummary(Long id) {
        userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return balanceService.calculateFinancialSummaryByUserId(id);
    }

    @Transactional
    public UserDTO registerUser(UserRegisterDTO userRegisterDTO) {
        if (!userRegisterDTO.getPassword().equals(userRegisterDTO.getPasswordConfirmation())) {
            throw new BusinessException("Passwords do not match");
        }
        if (userRepository.existsByUsername(userRegisterDTO.getUsername())) {
            throw new BusinessException("Username already exists");
        }

        User user = new User();
        user.setUsername(userRegisterDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));

        user = userRepository.save(user);
        return new UserDTO(user, BigDecimal.ZERO);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

}
