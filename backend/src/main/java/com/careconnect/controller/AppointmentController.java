package com.careconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private static final List<Map<String, Object>> appointmentStore = new ArrayList<>();

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAppointments(
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String patientEmail,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(appointmentStore);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createAppointment(@RequestBody Map<String, Object> appointment) {
        String id = "apt-" + System.currentTimeMillis();
        String refId = "CC-2026-" + (1000 + new Random().nextInt(9000));
        appointment.put("id", id);
        appointment.put("referenceId", refId);
        appointment.put("status", "Confirmed");
        appointmentStore.add(0, appointment);
        return ResponseEntity.ok(appointment);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        for (Map<String, Object> apt : appointmentStore) {
            if (id.equals(apt.get("id"))) {
                apt.put("status", newStatus);
                return ResponseEntity.ok(apt);
            }
        }
        return ResponseEntity.ok(Collections.singletonMap("status", newStatus));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable String id, @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Cancelled by user");
        for (Map<String, Object> apt : appointmentStore) {
            if (id.equals(apt.get("id"))) {
                apt.put("status", "Cancelled");
                apt.put("cancelReason", reason);
                return ResponseEntity.ok(apt);
            }
        }
        return ResponseEntity.ok(Collections.singletonMap("status", "Cancelled"));
    }
}
