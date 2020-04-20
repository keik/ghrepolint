let results: Array<any> = [];

export const report = (params: {
  rule: string;
  repo: string;
  message: string;
}) => {
  results.push(params);
};

export const showReport = () =>
  console.log(
    results
      .sort((a, b) => (a.repo > b.repo ? 1 : -1))
      .map((a) => JSON.stringify(a))
      .join("\n")
  );
