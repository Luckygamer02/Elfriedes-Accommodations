package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Applieddiscounts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookedextrasRepository extends JpaRepository<Applieddiscounts, Long> {
}
