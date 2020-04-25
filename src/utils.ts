import octokit from "./octokit";

type TargetType = "org" | "user" | "repo";

export const detectTargetType = async (target: string): Promise<TargetType> => {
  if (false) return "user";
  try {
    await octokit.orgs.get({
      org: target,
    });
    return "org";
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  try {
    await octokit.users.getByUsername({
      username: target,
    });
    return "user";
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  throw new Error("target is not found");
};
