package com.jgmt.backend.accommodation.domain;

public enum Extratype {
    CLEANING,
    BREAKFAST,
    PARKING,
    SPA_ACCESS,
    GYM_ACCESS,
    LATE_CHECKOUT,
    EARLY_CHECKIN,
    ROOM_SERVICE,
    AIRPORT_SHUTTLE,
    PET_FRIENDLY,
    MINIBAR,
    EXTRA_BED,
    LAUNDRY_SERVICE,
    CITY_TOUR,
    CONCIERGE_SERVICE;

    // Optional: Add display name if needed
    public String getDisplayName() {
        return this.name().toLowerCase().replace('_', ' ');
    }
}