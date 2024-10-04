import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const token = core.getInput("repo-token", { required: true });
    const tag = core.getInput("tag", { required: true });
    const sha =
      core.getInput("commit-sha", { required: false }) || github.context.sha;

    const client = github.getOctokit(token);

    core.debug(`tagging #${sha} with tag ${tag}`);
    await client.rest.git.createRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `refs/tags/${tag}`,
      sha: sha
    });
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    } else {
      core.error(String(error));
      core.setFailed("An unknown error occurred");
    }
  }
}

run();
