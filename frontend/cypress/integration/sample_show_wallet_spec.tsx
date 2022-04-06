describe("Update privacy show wallet address option", () => {
  //Use the cy.fixture() method to pull data from fixture file
  beforeEach(function () {
    // "this" points at the test context object
    cy.fixture("user").then((user) => {
      // "this" is still the test context object
      this.user = user;
    });
  });

  it("should navigate to the index page", function () {
    // Start from the index page
    cy.visit("/");

    // Should enter your email
    cy.get("#standard-basic").type(this.user.email);

    // Should click to LOG IN / SIGN UP Button
    cy.get("#mui-1").click();

    // Should click to top right account menu button
    cy.get('[aria-label="Account"]').click();

    // Should click Settings & privacy menu item button
    cy.get(
      ".MuiMenu-root > .MuiPaper-root > .MuiList-root > :nth-child(3)"
    ).click();

    // Should click Privacy menu item button
    cy.get(
      ".MuiMenu-root > .MuiPaper-root > .MuiList-root > :nth-child(3)"
    ).click();

    // Should contains Show Wallet Address text
    cy.get(".MuiFormControlLabel-root > .MuiTypography-root").contains(
      "Show Wallet Address"
    );

    // Should click to Show Wallet Address switch
    cy.get(".MuiFormControlLabel-root > .MuiTypography-root").click();

    // Should get Alert message contains Privacy settings updated!
    cy.get(".MuiAlert-message").contains("Privacy settings updated!");
  });
});

export {};
