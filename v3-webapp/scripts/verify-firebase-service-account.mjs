const expectedProjectId = "bird-food-calculator-25e6d";
const secret = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

function fail(message) {
  console.error(`Firebase deployment credential preflight failed: ${message}`);
  process.exitCode = 1;
}

if (!secret?.trim()) {
  fail("the FIREBASE_SERVICE_ACCOUNT_JSON secret is empty or unavailable.");
} else {
  let serviceAccount;

  try {
    serviceAccount = JSON.parse(secret);
  } catch {
    fail(
      "the secret is not valid JSON. Store the complete service-account JSON document, not an individual key field."
    );
  }

  if (serviceAccount) {
    const requiredFields = [
      "type",
      "project_id",
      "private_key",
      "client_email",
    ];
    const missingFields = requiredFields.filter(
      field =>
        typeof serviceAccount[field] !== "string" ||
        !serviceAccount[field].trim()
    );

    if (missingFields.length > 0) {
      fail(
        `the JSON document is missing required non-empty field(s): ${missingFields.join(", ")}.`
      );
    } else if (serviceAccount.type !== "service_account") {
      fail('the JSON field "type" must be "service_account".');
    } else if (serviceAccount.project_id !== expectedProjectId) {
      fail(`the JSON field "project_id" must be "${expectedProjectId}".`);
    } else if (
      !serviceAccount.client_email.endsWith(".iam.gserviceaccount.com")
    ) {
      fail(
        'the JSON field "client_email" is not a service-account email address.'
      );
    } else if (
      !serviceAccount.private_key.startsWith("-----BEGIN PRIVATE KEY-----\n") ||
      !serviceAccount.private_key
        .trimEnd()
        .endsWith("-----END PRIVATE KEY-----")
    ) {
      fail('the JSON field "private_key" is not a complete PEM private key.');
    } else {
      console.log(
        `Firebase service-account JSON preflight passed for project "${expectedProjectId}".`
      );
    }
  }
}
