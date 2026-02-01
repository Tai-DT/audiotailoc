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
      ".vercel/**",
    ],
  },
  ...config,
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
