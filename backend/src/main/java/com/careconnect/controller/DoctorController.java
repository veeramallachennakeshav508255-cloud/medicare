package com.careconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDoctors() {
        // Returns list of doctors
        List<Map<String, Object>> doctors = new ArrayList<>();

        Map<String, Object> doc1 = new HashMap<>();
        doc1.put("id", "doc-1");
        doc1.put("name", "Dr. Sarah Mitchell");
        doc1.put("title", "Senior Consultant Cardiologist");
        doc1.put("specialty", "Cardiology");
        doc1.put("departmentId", "dep-cardio");
        doc1.put("avatar", "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600");
        doc1.put("qualifications", "MD, FACC, Harvard Medical School");
        doc1.put("experienceYears", 14);
        doc1.put("rating", 4.9);
        doc1.put("reviewCount", 342);
        doc1.put("consultationFee", 120);
        doc1.put("hospital", "CareConnect Central Heart Institute");
        doc1.put("availableDays", Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"));
        doc1.put("availableSlots", Arrays.asList("09:00 AM", "09:45 AM", "11:00 AM", "02:15 PM", "03:30 PM", "04:15 PM"));
        doc1.put("isAvailableToday", true);

        doctors.add(doc1);
        return ResponseEntity.ok(doctors);
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        Map<String, Object> res = new HashMap<>();
        res.put("doctorId", id);
        res.put("isAvailableToday", body.getOrDefault("isAvailableToday", true));
        return ResponseEntity.ok(res);
    }
}
