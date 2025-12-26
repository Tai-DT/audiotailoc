import next from "eslint-config-next";

const config = Array.isArray(next) ? next : [next];

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "playwright-report/**",
      "**/playwright-report/**",
    ],
  },
  ...config,
];
