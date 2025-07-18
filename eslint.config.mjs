import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    // Для всех файлов по умолчанию — 4 пробела
    {
        rules: {
            indent: ["error", 4],
        },
    },
    // Для файлов с табами (например, *.tabs.ts, *.tabs.tsx)
    {
        files: ["**/*.tabs.ts", "**/*.tabs.tsx"],
        rules: {
            indent: ["error", "tab"],
        },
    },
];

export default eslintConfig;
