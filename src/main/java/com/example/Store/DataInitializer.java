package com.example.Store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${admin.default.username}")
    private String defaultUsername;

    @Value("${admin.default.password}")
    private String defaultPassword;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin if none exists
        if (adminRepository.count() == 0) {
            Admin defaultAdmin = new Admin();
            defaultAdmin.setUsername(defaultUsername);
            defaultAdmin.setPassword(passwordEncoder.encode(defaultPassword));
            defaultAdmin.setRole("ADMIN");

            adminRepository.save(defaultAdmin);
            System.out.println("Default admin user created: " + defaultUsername);
        }
    }
}