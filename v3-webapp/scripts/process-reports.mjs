import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import axios from 'axios';
import { labelsForImportedReport } from './report-labels.mjs';
import { normalizeQueuedReport } from './report-queue.mjs';

const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountEnv) {
  console.log("No FIREBASE_SERVICE_ACCOUNT_JSON provided. Skipping report processing.");
  process.exit(0);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountEnv);
} catch (e) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", e);
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function claimNewReport(ref) {
  return db.runTransaction(async transaction => {
    const current = await transaction.get(ref);
    if (!current.exists || current.data().status !== "new") {
      return null;
    }

    transaction.update(ref, {
      status: "processing",
      processingAt: new Date(),
    });

    return current.data();
  });
}

async function run() {
  const snapshot = await db.collection('reports').where('status', '==', 'new').get();
  if (snapshot.empty) {
    console.log("No new reports found.");
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "Crypto-Shroom/Bird-Feed-Calculator";
  if (!token) {
    throw new Error("GITHUB_TOKEN is required to process queued reports.");
  }

  for (const docSnap of snapshot.docs) {
    const data = await claimNewReport(docSnap.ref);
    if (!data) {
      console.log(`Skipping report ${docSnap.id}: it is no longer queued.`);
      continue;
    }

    try {
      const report = normalizeQueuedReport(data);
      console.log(`Processing report ${docSnap.id}: ${report.title}`);
      const response = await axios.post(
        `https://api.github.com/repos/${repo}/issues`,
        {
          title: report.title,
          body: `${report.body}\n\n---\n*Queued via Firestore and processed automatically.*`,
          labels: labelsForImportedReport(report.labels)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
          }
        }
      );

      const issueUrl = response.data.html_url;
      console.log(`Created GitHub issue: ${issueUrl}`);

      await docSnap.ref.update({
        status: "processed",
        githubIssueUrl: issueUrl,
        processedAt: new Date()
      });
    } catch (err) {
      const reason = err.response?.data?.message || err.message || "Unknown processing error.";
      console.error(`Failed to process report ${docSnap.id}: ${reason}`);
      await docSnap.ref.update({
        status: "rejected",
        rejectedAt: new Date(),
        rejectionReason: String(reason).slice(0, 500),
      });
    }
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
