package com.jgmt.backend.accommodation.infrastructure.controller.job.handlers;

import com.jgmt.backend.accommodation.domain.Booking;
import com.jgmt.backend.accommodation.domain.repository.BookingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.job.SendBookingConformationJob;
import com.jgmt.backend.email.EmailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;


import java.util.List;

@Component
@RequiredArgsConstructor
public class SendBookingConformationHandler implements JobRequestHandler<SendBookingConformationJob> {
    private final SpringTemplateEngine templateEngine;
    private final EmailService emailService;
    private final BookingRepository bookingRepository;

    @Transactional
    @Override
    public void run(SendBookingConformationJob jobRequest) throws Exception {
        sendBookingConformationEmail(jobRequest );
    }

    private void sendBookingConformationEmail(SendBookingConformationJob jobRequest) {
        Booking booking = bookingRepository.findById(jobRequest.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found: " + jobRequest.getBookingId()));

        Context thymeleafContext = new Context();
        thymeleafContext.setVariable("booking", booking);
        String htmlBody = templateEngine.process("booking-conformation", thymeleafContext);
        emailService.sendHtmlMessage(List.of(booking.getEmail()), "BookingConformation", htmlBody);
    }


}
