package com.resaletracker.financialapi.dtos;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class UserDTO {
    private Long id;
    private String username;
    private BigDecimal balance;
}
