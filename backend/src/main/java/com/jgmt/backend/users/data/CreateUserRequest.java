package com.jgmt.backend.users.data;

import com.jgmt.backend.accommodation.domain.Address;
import com.jgmt.backend.util.Client;
import com.jgmt.backend.util.validators.PasswordMatch;
import com.jgmt.backend.util.validators.Unique;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@PasswordMatch(passwordField = "password", passwordConfirmationField = "passwordConfirmation")
@Builder
@Client
public class CreateUserRequest {
    @Email
    @Unique(columnName = "email", tableName = "user", message = "User with this email already exists")
    private String email;
    @NotNull
    @Length(min = 8)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "must contain at least one uppercase letter, one lowercase letter, and one digit.")
    private String password;
    private String passwordConfirmation;
    @Nullable
    private String firstName;
    @Nullable
    private String lastName;

    @Nullable
    private String phoneNumber;

    @Nullable
    private Address profileImageUrl;

}