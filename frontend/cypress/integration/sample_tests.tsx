const uuid = () => Cypress._.random(0, 1e6);

describe("sample tests", () => {
  //Use the cy.fixture() method to pull data from fixture file
  beforeEach(function () {
    // "this" points at the test context object
    cy.fixture("user").then((user) => {
      // "this" is still the test context object
      this.user = user;

      // Start from the index page
      cy.visit("/");

      // Should enter your email
      cy.get("#standard-basic").type(user.email);

      // Should click to LOG IN / SIGN UP Button
      cy.get("#mui-1").click();
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

  it("Log out test", function () {
    // Click to top right account menu
    cy.get('[aria-label="Account"]').click();

    // Click to open Log Out modal button
    cy.get("[id^=open_logout_modal]").click();

    // Call logout endpoint and check response.status if it is equal to 200
    cy.request("POST", "http://localhost:3000/api/logout").then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it.only("Edit profile name & username test", function () {
    const id = uuid();

    // Match update-profile POST request as "update-profile"
    cy.intercept("POST", "/api/update-profile").as("update-profile");

    // Get drawer profile button and wait 3sec
    cy.get("[id^=drawer_profile_button]");

    cy.wait(3000);

    // Click to drawer profile button
    cy.get("[id^=drawer_profile_button]").click();

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

  it.only("Twitter link-unlink test", function () {
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
});

export {};
