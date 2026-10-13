package com.careconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiTriageController {

    @PostMapping("/triage")
    public ResponseEntity<Map<String, Object>> triageSymptoms(@RequestBody Map<String, String> request) {
        String prompt = request.getOrDefault("prompt", "").toLowerCase();
        Map<String, Object> response = new HashMap<>();

        boolean isEmergency = prompt.contains("chest pain") || prompt.contains("heart attack") || prompt.contains("shortness of breath");
        
        response.put("isEmergency", isEmergency);
        if (isEmergency) {
            response.put("summary", "CRITICAL WARNING: Symptoms indicate potential acute cardiovascular or respiratory distress requiring emergency care.");
            response.put("recommendedSpecialty", "Cardiology / Emergency Medicine");
        } else if (prompt.contains("fever") || prompt.contains("cough") || prompt.contains("sore throat")) {
            response.put("summary", "Symptoms suggest an upper respiratory viral or bacterial infection.");
            response.put("recommendedSpecialty", "General Medicine");
            response.put("secondarySpecialty", "ENT (Otolaryngology)");
        } else {
            response.put("summary", "Clinical AI recommendation for general assessment.");
            response.put("recommendedSpecialty", "General Medicine");
        }

        response.put("disclaimer", "CareConnect AI does not provide medical diagnosis. Please consult a licensed physician.");
        return ResponseEntity.ok(response);
    }
}
