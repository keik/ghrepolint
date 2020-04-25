type Report = {
  rule: string;
  repo: string;
  message: string;
};

const results: Array<Report> = [];

export const report = (params: Report): void => {
  results.push(params);
};

export const showReport = (): void =>
  console.log(
    results
      .sort((a, b) => (a.repo > b.repo ? 1 : -1))
      .map((a) => JSON.stringify(a))
      .join("\n")
  );
