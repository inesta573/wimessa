package com.example.Store;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AirtableResponse {

    @JsonProperty("records")
    private List<AirtableRecord> records;

    public List<AirtableRecord> getRecords() {
        return records;
    }

    public void setRecords(List<AirtableRecord> records) {
        this.records = records;
    }
}
