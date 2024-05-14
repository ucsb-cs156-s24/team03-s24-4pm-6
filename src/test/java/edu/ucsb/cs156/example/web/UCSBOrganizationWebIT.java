package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_organization() throws Exception {
        setupUser(true);

        page.getByText("UCSBOrganization").click();

        page.getByText("Create UCSBOrganization").click();
        assertThat(page.getByText("Create New UCSBOrganization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgCode").fill("SKY");
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Sky High");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Sky High Club");
        page.getByTestId("UCSBOrganizationForm-inactive").check();
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
                .hasText("Sky High");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSBOrganization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Sky Zone");
        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort")).hasText("Sky Zone");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_organization() throws Exception {
        setupUser(false);

        page.getByText("UCSBOrganization").click();

        assertThat(page.getByText("Create UCSBOrganization")).not().isVisible();
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }
}