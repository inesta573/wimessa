package com.example.Store;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AirtableRecord {

    @JsonProperty("id")
    private String id;

    @JsonProperty("fields")
    private AirtableFields fields;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public AirtableFields getFields() {
        return fields;
    }

    public void setFields(AirtableFields fields) {
        this.fields = fields;
    }
}
