package com.jgmt.backend.accommodation;

import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
public class Applieddiscounts extends AbstractEntity {
    Timestamp time;
    Long discountid;
}
