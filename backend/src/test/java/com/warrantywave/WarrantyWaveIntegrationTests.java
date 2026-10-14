package com.warrantywave;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.warrantywave.dto.AuthRequest;
import com.warrantywave.dto.RegisterRequest;
import com.warrantywave.model.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WarrantyWaveIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testPublicWarrantyPlansEndpoint() throws Exception {
        mockMvc.perform(get("/api/plans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", instanceOf(java.util.List.class)));
    }

    @Test
    void testRegisterNewCustomer() throws Exception {
        RegisterRequest register = new RegisterRequest();
        register.setFirstName("Sarah");
        register.setLastName("Connor");
        register.setEmail("sarah." + System.nanoTime() + "@cyberdyne.org");
        register.setPassword("Password@999");
        register.setRole(UserRole.ADMIN); // Attempt privilege escalation

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("Registration successful")));

        // Attempt login to verify user is CUSTOMER, NOT ADMIN
        AuthRequest login = new AuthRequest();
        login.setEmail(register.getEmail());
        login.setPassword("Password@999");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("CUSTOMER"))); // Escalation blocked!
    }

    @Test
    void testUnauthorizedAccessToVehiclesReturns401() throws Exception {
        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(401)));
    }

    @Test
    void testCustomerForbiddenFromAdminEndpointReturns403() throws Exception {
        RegisterRequest register = new RegisterRequest();
        register.setFirstName("Test"); register.setLastName("Customer");
        register.setEmail("customer." + System.nanoTime() + "@example.org"); register.setPassword("Password@123"); register.setRole(UserRole.CUSTOMER);
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(register))).andExpect(status().isOk());
        AuthRequest login = new AuthRequest(); login.setEmail(register.getEmail()); login.setPassword("Password@123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("token").asText();

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is(403)));
    }
}
