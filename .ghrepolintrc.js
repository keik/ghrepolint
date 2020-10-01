module.exports = {
  rules: {
    "require-branch-protection": {
      requireCodeOwnerReviews: true,
      requiredStatusChecks: [
        "ci/circleci: rspec",
        "ci/circleci: test_js",
        "ci/circleci: eslint_flow",
        "ci/circleci: danger",
        "danger/danger",
      ],
    },
    "require-ci": {
      configFilepath: "./circleci/config.yml",
    },
    "require-codeowners": true,
    "require-topics": true,
  },
};
