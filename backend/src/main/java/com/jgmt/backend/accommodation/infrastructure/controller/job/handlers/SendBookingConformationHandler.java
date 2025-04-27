package com.jgmt.backend.accommodation.infrastructure.controller.job.handlers;

import com.jgmt.backend.accommodation.domain.Booking;
import com.jgmt.backend.accommodation.domain.repository.BookingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.job.SendBookingConformationJob;
import com.jgmt.backend.email.EmailService;
import com.jgmt.backend.email.PdfGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;


import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SendBookingConformationHandler implements JobRequestHandler<SendBookingConformationJob> {
    private final SpringTemplateEngine templateEngine;
    private final EmailService emailService;
    private final BookingRepository bookingRepo;
    private final PdfGenerator pdfGen;

    @Transactional
    @Override
    public void run(SendBookingConformationJob jobRequest) throws Exception {
        sendBookingConfirmation(jobRequest );
    }

    public void sendBookingConfirmation(SendBookingConformationJob jobRequest) {
        Booking booking = bookingRepo.findById(jobRequest.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("No booking " + jobRequest.getBookingId()));

        // --- HTML body:
        Context thymeleafCtx = new Context();
        thymeleafCtx.setVariable("booking", booking);
        String htmlBody = templateEngine.process("booking-confirmation", thymeleafCtx);

        // --- PDF invoice:
        Map<String,Object> pdfVars = Map.of("booking", booking);
        byte[] invoicePdf;
        try {
            invoicePdf = pdfGen.generatePdf("invoice-template", pdfVars);
        } catch (Exception e) {
            throw new RuntimeException("Failed to render PDF", e);
        }

        // --- Send
        try {
            emailService.sendHtmlMessageWithAttachment(
                    List.of(booking.getEmail()),
                    "Your Booking Confirmation & Invoice",
                    htmlBody,
                    invoicePdf,
                    "Invoice-" + booking.getId() + ".pdf"
            );
        } catch (Exception ex) {
            throw new RuntimeException("Email sending failed", ex);
        }
        }

}
