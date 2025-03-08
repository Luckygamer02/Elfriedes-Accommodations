package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.users.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccomidationRepository extends JpaRepository<Accomidation, Long> {
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByEmail(@Param("id") int id);
}
