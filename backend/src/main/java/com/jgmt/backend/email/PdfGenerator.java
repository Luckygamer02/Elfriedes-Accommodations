package com.jgmt.backend.email;

import org.springframework.stereotype.Component;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.util.Map;

@Component
public class PdfGenerator {

    private final SpringTemplateEngine templateEngine;

    public PdfGenerator(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    /**
     * Renders given Thymeleaf template + variables to a PDF byte array
     */
    public byte[] generatePdf(String templateName, Map<String, Object> variables) throws Exception {
        // 1) Render HTML
        Context ctx = new Context();
        ctx.setVariables(variables);
        String html = templateEngine.process(templateName, ctx);

        // 2) Render to PDF
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(baos);
            return baos.toByteArray();
        }
    }
}
