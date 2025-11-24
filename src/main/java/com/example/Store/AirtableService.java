package com.example.Store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AirtableService {

    private final WebClient webClient;
    private final String baseId;
    private final String tableName;

    @Autowired
    public AirtableService(
            WebClient airtableWebClient,
            @Qualifier("airtableBaseId") String baseId,
            @Qualifier("airtableTableName") String tableName) {
        this.webClient = airtableWebClient;
        this.baseId = baseId;
        this.tableName = tableName;
    }

    public List<Resource> getResources() {
        try {
            // Build the URL with filterByFormula to get only published resources
            String url = String.format("/%s/%s?filterByFormula={Status}='Published'",
                    baseId, tableName);

            AirtableResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(AirtableResponse.class)
                    .block(); // Blocking call for simplicity

            if (response == null || response.getRecords() == null) {
                return new ArrayList<>();
            }

            // Convert Airtable records to Resource objects
            return response.getRecords().stream()
                    .map(this::convertToResource)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            System.err.println("Error fetching resources from Airtable: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private Resource convertToResource(AirtableRecord record) {
        AirtableFields fields = record.getFields();
        Resource resource = new Resource();

        resource.setTitle(fields.getTitle() != null ? fields.getTitle() : "");
        resource.setDescription(fields.getDescription() != null ? fields.getDescription() : "");
        resource.setCategory(fields.getCategory() != null ? fields.getCategory() : "");
        resource.setLink(fields.getLink() != null ? fields.getLink() : "");

        return resource;
    }
}
