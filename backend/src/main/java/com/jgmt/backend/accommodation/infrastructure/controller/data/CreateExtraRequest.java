package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.jgmt.backend.accommodation.domain.Extratype;
import lombok.*;

import java.io.Serializable;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateExtraRequest implements Serializable {
    Long id;
    String type;
    int price;
}