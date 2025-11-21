package com.example.Store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private MaktoubRepository maktoubRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private static final String UPLOAD_DIR = "uploads/maktoub/";

    // Event endpoints
    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<Event> getEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/events")
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setTitle(eventDetails.getTitle());
                    event.setDescription(eventDetails.getDescription());
                    event.setLocation(eventDetails.getLocation());
                    event.setEventDate(eventDetails.getEventDate());
                    event.setTime(eventDetails.getTime());
                    event.setCategory(eventDetails.getCategory());
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(event -> {
                    eventRepository.delete(event);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Resource endpoints
    @GetMapping("/resources")
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @GetMapping("/resources/{id}")
    public ResponseEntity<Resource> getResource(@PathVariable Long id) {
        return resourceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/resources")
    public Resource createResource(@RequestBody Resource resource) {
        return resourceRepository.save(resource);
    }

    @PutMapping("/resources/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @RequestBody Resource resourceDetails) {
        return resourceRepository.findById(id)
                .map(resource -> {
                    resource.setTitle(resourceDetails.getTitle());
                    resource.setDescription(resourceDetails.getDescription());
                    resource.setCategory(resourceDetails.getCategory());
                    resource.setLink(resourceDetails.getLink());
                    return ResponseEntity.ok(resourceRepository.save(resource));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        return resourceRepository.findById(id)
                .map(resource -> {
                    resourceRepository.delete(resource);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Maktoub endpoints
    @GetMapping("/maktoub")
    public List<Maktoub> getAllMaktoub() {
        return maktoubRepository.findAll();
    }

    @GetMapping("/maktoub/{id}")
    public ResponseEntity<Maktoub> getMaktoub(@PathVariable Long id) {
        return maktoubRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/maktoub")
    public ResponseEntity<Maktoub> createMaktoub(
            @RequestParam("paperType") String paperType,
            @RequestParam("title") String title,
            @RequestParam("studentName") String studentName,
            @RequestParam("date") String dateString,
            @RequestParam("description") String description,
            @RequestParam("pdf") MultipartFile pdfFile) {

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = pdfFile.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Save the file
            Files.copy(pdfFile.getInputStream(), filePath);

            // Create Maktoub object
            Maktoub maktoub = new Maktoub();
            maktoub.setPaperType(paperType);
            maktoub.setTitle(title);
            maktoub.setStudentName(studentName);
            maktoub.setDate(LocalDate.parse(dateString));
            maktoub.setDescription(description);
            maktoub.setPdfUrl("/uploads/maktoub/" + uniqueFilename);

            return ResponseEntity.ok(maktoubRepository.save(maktoub));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/maktoub/{id}")
    public ResponseEntity<?> updateMaktoub(
            @PathVariable Long id,
            @RequestParam("paperType") String paperType,
            @RequestParam("title") String title,
            @RequestParam("studentName") String studentName,
            @RequestParam("date") String dateString,
            @RequestParam("description") String description,
            @RequestParam(value = "pdf", required = false) MultipartFile pdfFile) {

        return maktoubRepository.findById(id)
                .map(maktoub -> {
                    maktoub.setPaperType(paperType);
                    maktoub.setTitle(title);
                    maktoub.setStudentName(studentName);
                    maktoub.setDate(LocalDate.parse(dateString));
                    maktoub.setDescription(description);

                    // Update PDF if a new file is provided
                    if (pdfFile != null && !pdfFile.isEmpty()) {
                        try {
                            // Delete old file
                            String oldPdfUrl = maktoub.getPdfUrl();
                            if (oldPdfUrl != null) {
                                Path oldFilePath = Paths.get(oldPdfUrl.replace("/uploads/maktoub/", UPLOAD_DIR));
                                Files.deleteIfExists(oldFilePath);
                            }

                            // Create upload directory if it doesn't exist
                            Path uploadPath = Paths.get(UPLOAD_DIR);
                            if (!Files.exists(uploadPath)) {
                                Files.createDirectories(uploadPath);
                            }

                            // Save new file
                            String originalFilename = pdfFile.getOriginalFilename();
                            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
                            Path filePath = uploadPath.resolve(uniqueFilename);
                            Files.copy(pdfFile.getInputStream(), filePath);

                            maktoub.setPdfUrl("/uploads/maktoub/" + uniqueFilename);
                        } catch (IOException e) {
                            return (ResponseEntity<?>) ResponseEntity.internalServerError().build();
                        }
                    }

                    return (ResponseEntity<?>) ResponseEntity.ok(maktoubRepository.save(maktoub));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/maktoub/{id}")
    public ResponseEntity<?> deleteMaktoub(@PathVariable Long id) {
        return maktoubRepository.findById(id)
                .map(maktoub -> {
                    // Delete the PDF file
                    String pdfUrl = maktoub.getPdfUrl();
                    if (pdfUrl != null) {
                        try {
                            Path filePath = Paths.get(pdfUrl.replace("/uploads/maktoub/", UPLOAD_DIR));
                            Files.deleteIfExists(filePath);
                        } catch (IOException e) {
                            // Log error but continue with deletion
                        }
                    }

                    maktoubRepository.delete(maktoub);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Get current user info
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        return adminRepository.findByUsername(principal.getName())
                .map(admin -> {
                    UserInfo userInfo = new UserInfo();
                    userInfo.setUsername(admin.getUsername());
                    userInfo.setRole(admin.getRole());
                    return ResponseEntity.ok(userInfo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin management endpoints
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(java.security.Principal principal) {
        // Check if current user is admin
        return adminRepository.findByUsername(principal.getName())
                .map(currentUser -> {
                    if (!"ADMIN".equals(currentUser.getRole())) {
                        return (ResponseEntity<?>) ResponseEntity.status(403).body("Access denied");
                    }
                    List<Admin> users = adminRepository.findAll();
                    return (ResponseEntity<?>) ResponseEntity.ok(users);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserRequest request, java.security.Principal principal) {
        // Check if current user is admin
        return adminRepository.findByUsername(principal.getName())
                .map(currentUser -> {
                    if (!"ADMIN".equals(currentUser.getRole())) {
                        return ResponseEntity.status(403).body("Only admins can create users");
                    }

                    // Check if username already exists
                    if (adminRepository.findByUsername(request.getUsername()).isPresent()) {
                        return ResponseEntity.badRequest().body("Username already exists");
                    }

                    Admin newUser = new Admin();
                    newUser.setUsername(request.getUsername());
                    newUser.setPassword(passwordEncoder.encode(request.getPassword()));
                    newUser.setRole(request.getRole() != null ? request.getRole() : "USER");

                    return ResponseEntity.ok(adminRepository.save(newUser));
                })
                .orElse(ResponseEntity.status(401).body("Not authenticated"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, java.security.Principal principal) {
        // Check if current user is admin
        return adminRepository.findByUsername(principal.getName())
                .map(currentUser -> {
                    if (!"ADMIN".equals(currentUser.getRole())) {
                        return ResponseEntity.status(403).body("Only admins can delete users");
                    }

                    // Prevent deleting yourself
                    if (currentUser.getId().equals(id)) {
                        return ResponseEntity.badRequest().body("Cannot delete your own account");
                    }

                    return adminRepository.findById(id)
                            .map(userToDelete -> {
                                adminRepository.delete(userToDelete);
                                return ResponseEntity.ok().body("User deleted successfully");
                            })
                            .orElse(ResponseEntity.notFound().build());
                })
                .orElse(ResponseEntity.status(401).body("Not authenticated"));
    }

    // Password change endpoint
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody PasswordChangeRequest request,
            java.security.Principal principal) {

        // Get the currently authenticated user
        String username = principal.getName();

        return adminRepository.findByUsername(username)
                .map(admin -> {
                    // Verify current password
                    if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPassword())) {
                        return ResponseEntity.badRequest().body("Current password is incorrect");
                    }

                    // Update password
                    admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    adminRepository.save(admin);

                    return ResponseEntity.ok().body("Password updated successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DTO for admin creation
    public static class AdminRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // DTO for password change
    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
