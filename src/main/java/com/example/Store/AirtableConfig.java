package com.example.Store;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AirtableConfig {

    @Value("${AIRTABLE_API_KEY}")
    private String apiKey;

    @Bean
    public WebClient airtableWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.airtable.com/v0")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean
    public String airtableBaseId(@Value("${AIRTABLE_BASE_ID}") String baseId) {
        return baseId;
    }

    @Bean
    public String airtableTableName(@Value("${AIRTABLE_TABLE_NAME}") String tableName) {
        return tableName;
    }
}
