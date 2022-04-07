import "cypress-file-upload";

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

    cy.wait(20000);

    cy.get('.MuiList-root > [role="button"]').click();

    cy.get(
      ".css-t0rabr-MuiButtonBase-root-MuiButton-root > .MuiTypography-root"
    );

    // Should click to Edit Profile button
    cy.get(
      ".css-t0rabr-MuiButtonBase-root-MuiButton-root > .MuiTypography-root"
    ).click();

    cy.get("[id^=uploadBanner]").click();

    cy.wait(2000);

    const filepath = "images/logo-dark.png";
    cy.get('input[type="file"]').attachFile(filepath);

    cy.wait(2000);

    cy.get("[id^=saveProfile]").click();
  });
});

export {};
