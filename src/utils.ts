import octokit from "./octokit";
import { Repository } from "./types";

export const getRepositoriesFromTarget = async (
  target: string
): Promise<Array<Repository>> => {
  let rawRepos: Array<any>;

  let m;
  if ((m = target.match(/^(?<owner>[\w]+?)\/(?<repo>[\w]+?)$/)) && m.groups) {
    const { data } = await octokit.repos.get({
      owner: m.groups.owner,
      repo: m.groups.repo,
    });
    rawRepos = [data];
  } else if (!target.match(/^\w+$/)) {
    throw new Error("target is invalid");
  } else {
    rawRepos = await octokit.paginate(octokit.repos.listForUser, {
      username: target,
    });
  }

  return rawRepos.map(
    (a: any): Repository => {
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

// TOOD: wrap
export const getBranchProtection = async (repo: Repository) => {
  const x = await octokit.repos.getBranchProtection({
    owner: repo.owner,
    repo: repo.name,
    branch: repo.defaultBranch,
  });

  return x;
};

// TOOD: wrap
export const getContents = async (repo: Repository, path: string) => {
  const { data: rawContent } = await octokit.repos.getContents({
    owner: repo.owner,
    repo: repo.name,
    path: path,
  });
  return rawContent;
};

// TOOD: wrap
export const getTopics = async (repo: Repository) => {
  const { data: rawTopics } = await octokit.repos.getAllTopics({
    owner: repo.owner,
    repo: repo.name,
  });
  return rawTopics;
};
