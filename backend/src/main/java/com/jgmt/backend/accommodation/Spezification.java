package com.jgmt.backend.accommodation;

import com.jgmt.backend.util.Client;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
public class Spezification {
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
