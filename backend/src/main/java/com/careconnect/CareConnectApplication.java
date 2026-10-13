package com.careconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CareConnectApplication {
    public static void main(String[] args) {
        SpringApplication.run(CareConnectApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  CareConnect AI Spring Boot Backend Started!     ");
        System.out.println("  API URL: http://localhost:8080                  ");
        System.out.println("  H2 Console: http://localhost:8080/h2-console    ");
        System.out.println("==================================================");
    }
}
