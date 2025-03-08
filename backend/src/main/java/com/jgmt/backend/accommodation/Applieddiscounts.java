package com.jgmt.backend.accommodation;

import com.jgmt.backend.util.Client;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
public class Applieddiscounts {
    Timestamp time;
    @OneToOne
    Long discountid;
}
