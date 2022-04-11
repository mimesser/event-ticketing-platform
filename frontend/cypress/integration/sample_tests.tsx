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
});

export {};
