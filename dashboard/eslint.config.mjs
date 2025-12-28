import next from "eslint-config-next";

const config = Array.isArray(next) ? next : [next];

const eslintConfig = [
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

export default eslintConfig;
