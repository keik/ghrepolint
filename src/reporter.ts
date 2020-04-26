import chalk from "chalk";
import table from "text-table";

type Report = {
  rule: string;
  repo: string;
  message: string;
};

const results: Array<Report> = [];

export const report = (params: Report): void => {
  results.push(params);
};

const pluralize = (word: string, count: number): string => {
  return count === 1 ? word : `${word}s`;
};

export const showReport = (): void => {
  const sortedResults = results.sort((a, b) =>
    a.repo > b.repo ? 1 : a.rule > b.rule ? 1 : -1
  );
  const groupedResults = results.reduce((acc, r) => {
    if (!acc[r.repo]) acc[r.repo] = [];
    acc[r.repo].push(r);
    return acc;
  }, {} as { [repoName: string]: Array<Report> });
  let output = Object.keys(groupedResults)
    .map((repoName) => {
      return [
        chalk.underline(repoName),
        table(
          groupedResults[repoName].map((a) => {
            return ["", chalk.red(a.message), chalk.dim(a.rule)];
          }),
          { align: [null, "l", "r"] }
        ),
      ].join("\n");
    })
    .join("\n\n");

  if (results.length > 0) {
    output += chalk.red.bold(
      [
        "\n\n",
        "\u2716 ",
        results.length,
        pluralize(" problem", results.length),
        " in ",
        Object.keys(groupedResults).length,
        pluralize(" repo", Object.keys(groupedResults).length),
        "\n",
      ].join("")
    );
  }

  console.log(output);
};
