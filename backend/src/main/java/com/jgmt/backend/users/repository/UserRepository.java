package com.jgmt.backend.users.repository;

import com.jgmt.backend.users.Role;
import com.jgmt.backend.users.User;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(Role role);

    @Query("SELECT DISTINCT u FROM User u " +
            "LEFT JOIN FETCH u.sentMessages m " +
            "WHERE u.role = com.jgmt.backend.users.Role.USER " +
            "AND (SIZE(u.sentMessages) > 0 OR SIZE(u.receivedMessages) > 0)")
    List<User> findUsersWithSupportRequests();
}
