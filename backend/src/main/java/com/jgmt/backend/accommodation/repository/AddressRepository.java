package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}