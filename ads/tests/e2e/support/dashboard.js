Cypress.Commands.add("$getExpiredReservation", () => {
  cy.fixture("dashboard.json").then(data => {
    cy.intercept(`/api/dashboard/expired-reservation?*`, data.expired);
  });
});

Cypress.Commands.add("$getDashboardReservation", () => {
  cy.fixture("dashboard.json").then(data => {
    cy.intercept(
      `/api/dashboard/reservation-list?*startDate=*/*/*&endDate=*/*/*`,
      data.unCue
    );
  });
});

// Cypress.Commands.add("$getReservationCue", () => {
//   cy.fixture("dashboard.json").then(data => {
//     cy.intercept(
//       `/api/dashboard/reservation-list?*&statuses=0&statuses=1`,
//       data.unUpload
//     );
//   });
// });
