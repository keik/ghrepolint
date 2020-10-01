import { Octokit } from "@octokit/rest";

import { BranchProtection, Repository } from "../types";

type RawRepository = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getRepositoriesFromTarget = async (
  target: string
): Promise<Array<Repository>> => {
  let rawRepos: Array<RawRepository>;

  let m;
  if ((m = target.match(/^(?<owner>[\w-]+?)\/(?<repo>[\w-]+?)$/)) && m.groups) {
    const { data } = await octokit.repos.get({
      owner: m.groups.owner,
      repo: m.groups.repo,
    });
    rawRepos = [data];
  } else if (!target.match(/^[\w-]+$/)) {
    throw new Error("target is invalid");
  } else {
    rawRepos = await octokit.paginate(octokit.repos.listForUser, {
      username: target,
    });
  }

  return rawRepos.map(
    (a: RawRepository): Repository => {
      return {
        defaultBranch: a.default_branch,
        fullName: a.full_name,
        owner: a.owner.login,
        name: a.name,
        topics: a.topics,
      };
    }
  );
};

export const getBranchProtection = async (
  repo: Repository
): Promise<BranchProtection> => {
  const { data: rawBranchProtection } = await octokit.repos.getBranchProtection(
    {
      owner: repo.owner,
      repo: repo.name,
      branch: repo.defaultBranch,
    }
  );

  const requireCodeOwnerReviews =
    rawBranchProtection.required_pull_request_reviews
      .require_code_owner_reviews;
  const requiredStatusChecks =
    rawBranchProtection.required_status_checks.contexts;

  return {
    requireCodeOwnerReviews,
    requiredStatusChecks,
  };
};

export const getContents = async ({
  filepath,
  repositoryName,
  repositoryOwner,
}: {
  filepath: string;
  repositoryName: string;
  repositoryOwner: string;
}): Promise<string> => {
  const { data: rawContents } = await octokit.repos.getContent({
    owner: repositoryOwner,
    repo: repositoryName,
    path: filepath,
  });
  if (Array.isArray(rawContents))
    throw new Error("Directory exits, not a file");

  return Buffer.from(rawContents.content ?? "", "base64").toString();
};

export const getTopics = async (repo: Repository): Promise<Array<string>> => {
  const { data: rawTopics } = await octokit.repos.getAllTopics({
    owner: repo.owner,
    repo: repo.name,
  });
  return rawTopics.names;
};
