package com.resaletracker.financialapi.dtos.user;

import com.resaletracker.financialapi.entities.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String username;

    public UserSummaryDTO(User entity) {
        this.id = entity.getId();
        this.username = entity.getUsername();
    }
}
