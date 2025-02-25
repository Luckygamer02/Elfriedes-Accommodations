package com.jgmt.backend.users.data;

import com.jgmt.backend.util.Client;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Client
public class UpdateUserRequest {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
}
