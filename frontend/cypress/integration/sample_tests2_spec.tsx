const uuid = () => Cypress._.random(0, 1e6);

describe("sample tests 2", () => {
  //Use the cy.fixture() method to pull data from fixture file
  before(function () {
    // "this" points at the test context object
    cy.fixture("user").then((user) => {
      // "this" is still the test context object
      this.user = user;

      // Visit the index page
      cy.visit("/");

      // Should enter your email
      cy.get("#standard-basic").type(user.email);

      // Should click to LOG IN / SIGN UP Button
      cy.get("#mui-1").click();
    });

    // Check user account menu if successfully logged in
    cy.get('[aria-label="Account"]');
  });

  beforeEach(function () {
    // Start from the index page
    cy.visit("/");
  });

  it("Create and edit Event flow test", function () {
    const id = uuid();

    // Match save-event request as save-event
    cy.intercept("/api/event/save-event").as("save-event");

    // Match update-event request as update-event
    cy.intercept("/api/event/update-event").as("update-event");

    // Get Event button at homepage, wait 3sec then click
    cy.get("[id^=go_events_homepage]").wait(3000).click();

    // Click to Create new event button
    cy.get("[id^=create_new_event]").click();

    // Click to create event button card
    cy.get("[id^=create_event_card]").click();

    // Type to Event name input
    cy.get("[id^=event_name_input]").eq(1).type(`Test Event Name ${id}`);

    // Click to "+ End Date and Time"
    cy.get("[id^=show_end_date_time]").click();

    // Open event privacy menu
    cy.get("[id^=event_privacy_menu]").click();

    // Select privacy
    cy.get("[id^=event_privacy_select]").click();

    // Click to next button
    cy.get("[id^=event_next_button]").click();

    // Type to location input
    cy.get("[id^=event_location_input]").eq(1).type("San Francisco, CA, USA");

    // Click to next button
    cy.get("[id^=event_next_button]").click();

    // Type to event description input
    cy.get("[id^=event_description_input]")
      .eq(1)
      .type(`Test event description ${id}`);

    // Click to next button
    cy.get("[id^=event_next_button]").click();

    // Attach file to event cover photo
    const filepath = "images/logo-dark.png";
    cy.get("[id^=upload-cover-photo]").attachFile(filepath);

    // Check delete event cover photo button if visible
    cy.get("[id^=delete_event_cover_photo]").should("be.visible");

    // Click to next button as "Create Event"
    cy.get("[id^=event_next_button]").click();

    // Wait for save-event status code: 200 response
    cy.wait("@save-event").then(({ response }: any) => {
      expect(response.body).property("status");
      expect(response.body).property("eventId");
      expect(response.statusCode).to.eq(200);

      // Check pathname if contain event ID
      cy.location("pathname").should("include", `/${response.body.eventId}`);

      // Check event name if visible
      cy.contains(`Test Event Name ${id}`).should("be.visible");

      // Check location if visible
      cy.contains("San Francisco, CA, USA").should("be.visible");

      // Check event description if visible
      cy.contains(`Test event description ${id}`).should("be.visible");
    });

    // Click to edit event button
    cy.get("[id^=edit_event_btn]").wait(3000).click();

    // Type to Event name input
    cy.get("[id^=event_name_input]")
      .eq(1)
      .clear()
      .type(`Edited Test Event Name ${id}`);

    // Click to next button
    cy.get("[id^=event_next_button]").click();

    // Click to next button
    cy.get("[id^=event_next_button]").click();

    // Type to event description input
    cy.get("[id^=event_description_input]")
      .eq(1)
      .clear()
      .type(`Edited Test event description ${id}`);

    // Click to next button
    cy.get("[id^=event_next_button]").click();

    // Check delete event cover photo button if visible then click
    cy.get("[id^=delete_event_cover_photo]").should("be.visible").click();

    // Attach file to event cover photo
    cy.get("[id^=upload-cover-photo]").attachFile(filepath);

    // Check delete event cover photo button if visible
    cy.get("[id^=delete_event_cover_photo]").should("be.visible");

    // Click to next button as "Update"
    cy.get("[id^=event_next_button]").click();

    // Wait for update-event status code: 200 response
    cy.wait("@update-event").then(({ response }: any) => {
      expect(response.body).property("status");
      expect(response.body).property("eventId");
      expect(response.statusCode).to.eq(200);

      // Check pathname if contain event ID
      cy.location("pathname").should("include", `/${response.body.eventId}`);

      // Check event name if visible
      cy.contains(`Edited Test Event Name ${id}`).should("be.visible");

      // Check location if visible
      cy.contains("San Francisco, CA, USA").should("be.visible");

      // Check event description if visible
      cy.contains(`Edited Test event description ${id}`).should("be.visible");
    });
  });

  it("Edit profile name & username test", function () {
    const id = uuid();

    // Match update-profile POST request as "update-profile"
    cy.intercept("POST", "/api/update-profile").as("update-profile");

    // Get drawer profile button, wait 3sec and click
    cy.get("[id^=drawer_profile_button]").wait(3000).click();

    // Click to edit profile button
    cy.get("[id^=edit_profile_button]").click();

    // Click to edit name input and type "test123"
    cy.get("[id^=edit_name_input]").eq(1).clear().type(`testname${id}`);

    // Click to edit name input and type "test123"
    cy.get("[id^=edit_username_input]").eq(1).clear().type(`testusername${id}`);

    // Click to save button
    cy.get("[id^=saveProfile]").click();

    // Wait for update-profile status code: 200 response
    cy.wait("@update-profile").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });
  });

  it("Upload-remove profile banner test", function () {
    // Match upload-image POST request as "upload-image"
    cy.intercept("POST", "/api/upload-image").as("upload-image");

    // Match update-profile POST request as "update-profile"
    cy.intercept("POST", "/api/update-profile").as("update-profile");

    // Get drawer profile button, wait 3sec and click
    cy.get("[id^=drawer_profile_button]").wait(3000).click();

    // Click to edit profile button
    cy.get("[id^=edit_profile_button]").click();

    // Click to upload banner button
    cy.get("[id^=uploadBanner]").click();

    // Upload file
    const filepath = "images/logo-dark.png";
    cy.get('input[type="file"]').attachFile(filepath);

    // Wait for upload-image status code: 200 response
    cy.wait("@upload-image").then(({ response }: any) => {
      expect(response.body).property("url");
      expect(response.statusCode).to.eq(200);
    });

    // Click to save profile button
    cy.get("[id^=saveProfile]").click();

    // Wait for update-profile status code: 200 response
    cy.wait("@update-profile").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });

    // Check save profile button not exist
    cy.get("[id^=saveProfile]").should("not.exist");

    // Click to edit profile button
    cy.get("[id^=edit_profile_button]").click();

    // Click to remove banner button
    cy.get("[id^=removeBanner]").click();

    // Click to save profile button
    cy.get("[id^=saveProfile]").click();

    // Wait for update-profile status code: 200 response
    cy.wait("@update-profile").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });
  });

  // Log out test should be last because of preserve token cookie, add new test above
  it("Log out test", function () {
    // Match logout request as "logout"
    cy.intercept("DELETE", "/api/logout").as("logout");

    // Click to top right account menu
    cy.get('[aria-label="Account"]').click();

    // Click to open Log Out modal button
    cy.get("[id^=open_logout_modal]").click();

    // Click to Log Out button
    cy.get("[id^=logout_button]").click();

    // Wait for notifications status code: 200 response
    cy.wait("@logout").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });

    // Get email input field to finish test
    cy.get("#standard-basic");
  });
});

export {};
