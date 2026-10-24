package com.example.Warranty_Wave_Backend;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WarrantyWaveApiIntegrationTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void customerCanRegisterAuthenticateAndPersistVehicleAndClaim() throws Exception {
        String email = "customer-" + UUID.randomUUID() + "@example.com";
        String password = "strong-password-123";

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"firstName":"Test","lastName":"Customer","email":"%s","password":"%s","role":"ADMIN"}
                    """.formatted(email, password)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.message").value("Account created successfully."));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"firstName":"Test","lastName":"Customer","email":"%s","password":"%s"}
                    """.formatted(email, password)))
            .andExpect(status().isConflict());

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"%s","password":"%s"}
                    """.formatted(email, password)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.role").value("CUSTOMER"))
            .andReturn();
        JsonNode login = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = login.get("token").asText();

        MvcResult vehicleResult = mockMvc.perform(post("/api/vehicles")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "manufacturer":"Toyota",
                      "model":"Camry",
                      "manufactureYear":2023,
                      "category":"CAR",
                      "fuelType":"HYBRID",
                      "registrationNumber":"TEST-%s",
                      "vin":"1HGCM82633A004352",
                      "odometerReading":12000,
                      "color":"Silver"
                    }
                    """.formatted(UUID.randomUUID().toString().substring(0, 8))))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.manufacturer").value("Toyota"))
            .andReturn();
        long vehicleId = objectMapper.readTree(vehicleResult.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(get("/api/vehicles").header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(vehicleId));

        mockMvc.perform(post("/api/claims")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"vehicleId":%d,"issue":"Engine warning and loss of power","cost":850.25}
                    """.formatted(vehicleId)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.vehicleId").value(vehicleId))
            .andExpect(jsonPath("$.estimatedCost").value(850.25))
            .andExpect(jsonPath("$.status").value("SUBMITTED"));

        mockMvc.perform(get("/api/claims").header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].vehicleId").value(vehicleId))
            .andExpect(jsonPath("$.content[0].issue").value("Engine warning and loss of power"));
    }

    @Test
    void validationAndAuthorizationAreEnforced() throws Exception {
        mockMvc.perform(get("/api/plans"))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/vehicles"))
            .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"missing@example.com","password":"wrong-password"}
                    """))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Invalid email or password."));

        String email = "customer-" + UUID.randomUUID() + "@example.com";
        String password = "strong-password-123";
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"firstName":"Test","lastName":"Customer","email":"%s","password":"%s"}
                    """.formatted(email, password)))
            .andExpect(status().isCreated());

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"%s","password":"%s"}
                    """.formatted(email, password)))
            .andExpect(status().isOk())
            .andReturn();
        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
            .get("token").asText();

        mockMvc.perform(post("/api/claims")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"vehicleId":1,"issue":"short","cost":-1}
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").exists());

        mockMvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + token))
            .andExpect(status().isForbidden());
    }
}
