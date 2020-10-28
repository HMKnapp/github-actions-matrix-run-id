/**
 * Fetches ID of the current CI run from the Github API
 * Author: Herbert Knapp
 */

const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: process.env.GH_TOKEN });

// abort if we're not on Github CI
process.env.GITHUB_RUN_ID || process.exit(2);

const CI = {
  owner: process.env.GITHUB_REPOSITORY.split("/")[0],
  repo: process.env.GITHUB_REPOSITORY.split("/")[1],
  ref: process.env.GITHUB_SHA,
  event: process.env.GITHUB_EVENT_NAME,
  matrix_id: process.env.MATRIX_ID, // specified in workflow via ENV
  job_id: process.env.GITHUB_JOB,
};

async function getRunID(args) {
  // construct name to filter runs for ours in matrix jobs. is there a better way?
  const name = CI.matrix_id ? `${CI.job_id} (${CI.matrix_id})` : CI.job_id;

  var response;
  try {
    response = await octokit.request(
      "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
      {
        owner: CI.owner,
        repo: CI.repo,
        ref: CI.ref,
      }
    );
  } catch (error) {
    console.log(error.status);
    process.exit(1);
  }

  const runs = response.data.check_runs
    .filter((r) => r.name === name)
    // .filter((r) => Array.isArray(r.pull_requests))
    // .filter((r) =>
    //   CI.event === "pull_request"
    //     ? r.pull_requests.length
    //     : !r.pull_requests.length
    // );
  if (require.main !== module) return runs[0].id;
  // TODO: allow options {} for getRunID() in non-cli mode
  console.log(args.includes("--url") ? runs[0].html_url : runs[0].id);
}

if (require.main === module) {
  getRunID(process.argv);
}

exports.getRunID = getRunID;
