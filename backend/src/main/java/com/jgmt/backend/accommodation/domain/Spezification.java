package com.jgmt.backend.accommodation.domain;

import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
public class Spezification extends AbstractEntity {
    private boolean wifi;
    private boolean mobile;
    private boolean garden;
    private boolean tv;
    private boolean pool;
    private boolean kitchen;
    private boolean washingmachine;
    private boolean ac;
    private boolean microwave;
}
