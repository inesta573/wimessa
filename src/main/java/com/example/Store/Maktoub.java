package com.example.Store;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "maktoub")
public class Maktoub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paperType;

    private String title;

    private String studentName;

    private LocalDate date;

    @Column(length = 1000)
    private String description;

    private String pdfUrl;

    // Constructors
    public Maktoub() {}

    public Maktoub(String paperType, String title, String studentName, LocalDate date, String description, String pdfUrl) {
        this.paperType = paperType;
        this.title = title;
        this.studentName = studentName;
        this.date = date;
        this.description = description;
        this.pdfUrl = pdfUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaperType() {
        return paperType;
    }

    public void setPaperType(String paperType) {
        this.paperType = paperType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }
}
