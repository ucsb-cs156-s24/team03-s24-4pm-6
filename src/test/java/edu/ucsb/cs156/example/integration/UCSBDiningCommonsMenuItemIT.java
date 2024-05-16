package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemIT {
        @Autowired
        public CurrentUserService currentUserService;

        @Autowired
        public GrantedAuthoritiesService grantedAuthoritiesService;

        @Autowired
        UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

        @Autowired
        public MockMvc mockMvc;

        @Autowired
        public ObjectMapper mapper;

        @MockBean
        UserRepository userRepository;

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
                // arrange

                UCSBDiningCommonsMenuItem menuItem = UCSBDiningCommonsMenuItem.builder()
                                .name("burger")
                                .diningCommonsCode("DC1")
                                .station("Grill")
                                .build();
                                
                ucsbDiningCommonsMenuItemRepository.save(menuItem);

                // act
                MvcResult response = mockMvc.perform(get("/api/UCSBDiningCommonsMenuItem?id=1"))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String expectedJson = mapper.writeValueAsString(menuItem);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_UCSBDiningCommonsMenuItem() throws Exception {
                // arrange

                UCSBDiningCommonsMenuItem menuItem1 = UCSBDiningCommonsMenuItem.builder()
                                .id(1L)
                                .name("fries")
                                .diningCommonsCode("DC2")
                                .station("station2")
                                .build();

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/UCSBDiningCommonsMenuItem/post?name=fries&diningCommonsCode=DC2&station=station2")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                String expectedJson = mapper.writeValueAsString(menuItem1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }
}
