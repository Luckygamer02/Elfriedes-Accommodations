package com.jgmt.backend.accommodation;

import com.jgmt.backend.util.Client;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
@Table(name = "extras")
public class Extras {
    Extrastype type;
    int price;
}
