const uuid = () => Cypress._.random(0, 1e6);

describe("sample tests", () => {
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

  it("Privacy show wallet option test", function () {
    // Match show-wallet POST request as "show-wallet"
    cy.intercept("POST", "/api/show-wallet").as("show-wallet");

    // Click to top right account menu button
    cy.get('[aria-label="Account"]').wait(2000).click();

    // Click Settings & privacy menu item button
    cy.get(
      ".MuiMenu-root > .MuiPaper-root > .MuiList-root > :nth-child(3)"
    ).click();

    // Click Privacy menu item button
    cy.get(
      ".MuiMenu-root > .MuiPaper-root > .MuiList-root > :nth-child(3)"
    ).click();

    // Should contains Show Wallet Address text then click
    cy.get(".MuiFormControlLabel-root > .MuiTypography-root")
      .contains("Show Wallet Address")
      .click();

    // Wait for show-wallet status code: 200 response
    cy.wait("@show-wallet").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });

    // Should get Alert message contains Privacy settings updated!
    cy.get(".MuiAlert-message").contains("Privacy settings updated!");
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

  it("Dark mode test", function () {
    cy.get("html").then((html) => {
      // Click to top right account menu
      cy.get('[aria-label="Account"]').click();

      // Click Display menu item
      cy.get("[id^=display_menu_item]").click();

      if (html.attr("data-theme") === "dark") {
        // Click to Dark Mode off
        cy.get("[id^=light_mode]").click();

        // Check theme again if it is light
        cy.get("html").should("have.attr", "data-theme", "light");
      } else {
        // Click to Dark Mode on
        cy.get("[id^=dark_mode]").click();

        // Check theme again if it is dark
        cy.get("html").should("have.attr", "data-theme", "dark");
      }
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

  it("Twitter link-unlink test", function () {
    // Match twitter/link-user POST request as "link-user"
    cy.intercept("POST", "/api/twitter/link-user").as("link-user");

    // Click to top right account menu
    cy.get('[aria-label="Account"]').click();

    // Click to settings menu
    cy.get("[id^=settings_menu]").click();

    // Click to link Twitter button
    cy.get("[id^=link_twitter_button]").click();

    // Click to Find frens I follow button in Twitter modal
    cy.get("#Header_twtButton__zVX9n").click();

    // Wait for link-user status code: 200 response
    cy.wait("@link-user").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });

    // Call logout endpoint and check response.status if it is equal to 200
    cy.request("DELETE", "http://localhost:3000/api/twitter/link-user").then(
      (response) => {
        expect(response.status).to.eq(200);
      }
    );
  });

  it("User follow-unfollow test", function () {
    // Match follow request as follow
    cy.intercept("/api/twitter/follow").as("follow");

    // Get account menu before visit user
    cy.get('[aria-label="Account"]');

    // Go to user page
    cy.visit(
      "http://localhost:3000/0x94227F9e855F378001673c6862Bcc5b3F945Becc"
    );

    // Get follow_button then check text
    cy.get("[id^=follow_button]").then(($btn) => {
      if ($btn.contents().text() === "Follow") {
        // Click to follow_button to follow
        cy.get("[id^=follow_button]").click().wait(3000);

        // Check follow_button contains "Following"
        cy.get("[id^=follow_button]").contains("Following");
      } else {
        // Click to follow_button to unfollow
        cy.get("[id^=follow_button]").click();

        // Click to unfollow button in modal
        cy.get("[id^=unfollow_button_modal]").click().wait(3000);

        // Check follow_button contains "Follow"
        cy.get("[id^=follow_button]").contains("Follow");
      }

      // Wait for follow status code: 200 response
      cy.wait("@follow").then(({ response }: any) => {
        expect(response.statusCode).to.eq(200);
      });
    });
  });

  it("Notifications test", function () {
    // Match notifications DELETE request as "notifications"
    cy.intercept("DELETE", "/api/notifications").as("notifications");

    // Click to notifications menu button
    cy.get("[id^=notifications_menu]").click();

    // Click to mark notification as read button
    cy.get("[id^=mark_notification_as_read]").click();

    // Wait for notifications status code: 200 response
    cy.wait("@notifications").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });

    cy.wait(2000);

    // Check contains "Link your Twitter" if it is exists and click
    cy.contains("Link your Twitter").click();

    // Wait for notifications status code: 200 response
    cy.wait("@notifications").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });

    // Check contains "Find frens..." if it is exists and visible
    cy.contains("Find frens you follow on Twitter").should("be.visible");

    // Click to Header Twitter modal close button
    cy.get("[id^=header_twitter_modal_close]").click();

    // Check contains "To get started" if it is exists and click
    cy.contains("To get started").click();

    // Click to Header buy crypto modal close button
    cy.get("[id^=header_crypto_modal_close]").wait(2000).click();
  });

  it("Create Event flow test", function () {
    const id = uuid();

    // Match save-event request as save-event
    cy.intercept("/api/save-event").as("save-event");

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
