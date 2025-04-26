package com.jgmt.backend.accommodation.infrastructure.controller.job;

import com.jgmt.backend.accommodation.infrastructure.controller.job.handlers.SendBookingConformationHandler;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.jobrunr.jobs.lambdas.JobRequest;
import org.jobrunr.jobs.lambdas.JobRequestHandler;

@Getter
@AllArgsConstructor
public class SendBookingConformationJob implements JobRequest {

    Long BookingId;

    @Override
    public Class<? extends JobRequestHandler> getJobRequestHandler() {
        return SendBookingConformationHandler.class;
    }
}
