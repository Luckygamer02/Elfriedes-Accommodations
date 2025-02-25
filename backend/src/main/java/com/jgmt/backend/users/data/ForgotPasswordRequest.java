package com.jgmt.backend.users.data;

import com.jgmt.backend.util.Client;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
@Client
public class ForgotPasswordRequest {
    @Email
    private String email;
}
