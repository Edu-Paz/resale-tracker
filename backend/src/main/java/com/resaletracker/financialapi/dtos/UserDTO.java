package com.resaletracker.financialapi.dtos;

import com.resaletracker.financialapi.entities.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private BigDecimal balance;

    public UserDTO(User entity) {
        this.id = entity.getId();
        this.username = entity.getUsername();
        this.balance = entity.getBalance();
    }
}
