module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "./coverage",
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  resetMocks: true,
  clearMocks: true,
};
