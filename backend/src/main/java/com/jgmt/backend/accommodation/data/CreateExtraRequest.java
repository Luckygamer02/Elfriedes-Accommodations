package com.jgmt.backend.accommodation.data;

import com.jgmt.backend.accommodation.enums.Extrastype;
import lombok.*;

import java.io.Serializable;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateExtraRequest implements Serializable {
    Long id;
    Extrastype type;
    int price;
}