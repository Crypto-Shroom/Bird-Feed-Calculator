import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import axios from 'axios';

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

async function run() {
  const snapshot = await db.collection('reports').where('status', '==', 'new').get();
  if (snapshot.empty) {
    console.log("No new reports found.");
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "Crypto-Shroom/Bird-Feed-Calculator";

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    console.log(`Processing report ${docSnap.id}: ${data.title}`);

    try {
      const response = await axios.post(
        `https://api.github.com/repos/${repo}/issues`,
        {
          title: data.title,
          body: `${data.body}\n\n---\n*Queued via Firestore and processed automatically.*`,
          labels: data.labels || ["needs-research"]
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
      console.error(`Failed to process report ${docSnap.id}:`, err.response?.data || err.message);
    }
  }
}

run().catch(console.error);
