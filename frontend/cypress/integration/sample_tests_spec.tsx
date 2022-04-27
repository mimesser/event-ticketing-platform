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

  it("Twitter link-unlink test", function () {
    // Match twitter/link-user POST request as "link-user"
    cy.intercept("POST", "/api/twitter/link-user").as("link-user");

    // Match twitter/link-user DELETE request as "link-user"
    cy.intercept("DELETE", "/api/twitter/link-user").as("unlink-user");

    // Click to top right account menu
    cy.get('[aria-label="Account"]').click();

    // Click to settings menu
    cy.get("[id^=settings_menu]").click();

    // Click to link Twitter button
    cy.get("[id^=open_twitter_modal]").click();

    // Click to Find frens I follow button in Twitter modal
    cy.get("[id^=twt_link_unlink_btn]").then(($btn) => {
      if ($btn.contents().text() === "Find frens I follow") {
        cy.get("[id^=twt_link_unlink_btn]").click();

        // Wait for link-user status code: 200 response
        cy.wait("@link-user").then(({ response }: any) => {
          expect(response.statusCode).to.eq(200);
        });

        // Call DELETE link-user endpoint and check response.status if it is equal to 200
        cy.request(
          "DELETE",
          "http://localhost:3000/api/twitter/link-user"
        ).then((response) => {
          expect(response.status).to.eq(200);
        });
      } else {
        cy.get("[id^=twt_link_unlink_btn]").click();

        // Wait for unlink-user status code: 200 response
        cy.wait("@unlink-user").then(({ response }: any) => {
          expect(response.statusCode).to.eq(200);
        });
      }
    });
  });

  it("User follow-unfollow test", function () {
    // Match follow request as follow
    cy.intercept("/api/follow").as("follow");

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

  it("Follow list test", function () {
    // Match public-user POST request as "public-user"
    cy.intercept("POST", "/api/public-user").as("public-user");

    // Go to user page
    cy.visit(
      "http://localhost:3000/0x94227F9e855F378001673c6862Bcc5b3F945Becc"
    );

    // Wait for public-user status code: 200 response then check user following-followers numbers
    cy.wait("@public-user").then(({ response }: any) => {
      expect(response.body).property("user");
      expect(response.statusCode).to.eq(200);

      const followingNumber = `${response.body.user.following.length} Following`;
      const followersNumber = `${response.body.user.followers.length} Followers`;

      cy.contains(followingNumber).should("be.visible");
      cy.contains(followersNumber).should("be.visible");
    });

    // Click to Following button
    cy.get("[id^=gotofollowers]").click();

    // Check pathname if contain /followers
    cy.location("pathname").should("include", "/followers");

    cy.window()
      .its("__NEXT_DATA__")
      .then((data) => {
        const followers = data.props.pageProps.data.followers;
        const following = data.props.pageProps.data.following;

        // Check followers list user's username and walletAddress
        followers.map((m: any) => {
          if (!m.username) {
            cy.contains(m.walletAddress).should("be.visible");
          } else {
            cy.contains(m.username).should("be.visible");
          }

          if (m.name) {
            cy.contains("p", m.name).should("be.visible");
          }
        });

        // Click to Following button
        cy.get("[id^=following_tab]").click();

        // Check following list user's username and walletAddress
        following.map((m: any) => {
          if (!m.username) {
            cy.contains(m.walletAddress).should("be.visible");
          } else {
            cy.contains(m.username).should("be.visible");
          }

          if (m.name) {
            cy.contains("p", m.name).should("be.visible");
          }
        });
      });
  });

  it("Buy Crypto modal test", function () {
    // Match moonpay-verify POST request as "moonpay-verify"
    cy.intercept(
      "POST",
      "https://api.moonpay.com/v3/verify_widget_signature"
    ).as("moonpay-verify");

    // Click to Buy Crypto button at header
    cy.get("[id^=buy_crypto_header]").click();

    // Wait for moonpay-verify status code: 200 response
    cy.wait("@moonpay-verify").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });

    // Click to Header buy crypto modal close button
    cy.get("[id^=header_crypto_modal_close]").click();

    // Click to Purchase MATIC text which is dashboard Moonpay banner
    cy.contains("Purchase MATIC").click();

    // Wait for moonpay-verify status code: 200 response
    cy.wait("@moonpay-verify").then(({ response }: any) => {
      expect(response.statusCode).to.eq(200);
    });

    // Click to Dashboard buy crypto modal close button
    cy.get("[id^=dashboard_crypto_modal_close]").click();
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
