// eslint.config.js (ESLint 9, ESM/Flat)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  // 전역 ignore
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "dist/**", "next-env.d.ts"],
  },

  // 1) JS/JSX: 타입 없이 동작 (타입 의존 룰 들어오지 않음)
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // 2) TS/TSX: 타입 기반 프리셋을 "해당 파일에만" 스코프 적용
  //    - recommendedTypeChecked & (원하면) stylisticTypeChecked
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ...(cfg.languageOptions ?? {}),
      parserOptions: {
        ...(cfg.languageOptions?.parserOptions ?? {}),
        project: ["./tsconfig.eslint.json"], // 🔑 타입 정보 제공
        tsconfigRootDir: __dirname, // 🔑 루트 기준
      },
    },
  })),

  // TS/TSX에 Next 권장 룰 추가
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // 3) 항상 마지막: Prettier와 충돌나는 ESLint 룰 끄기
  prettier,
];
