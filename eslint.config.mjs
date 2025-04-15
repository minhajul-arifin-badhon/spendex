import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginUnusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

const isProd = process.env.NODE_ENV === "production";

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		plugins: {
			"unused-imports": pluginUnusedImports
		},
		rules: {
			...(isProd
				? {
						// 🔥 Enforce in production
						"unused-imports/no-unused-imports": "error",
						"unused-imports/no-unused-vars": [
							"error",
							{
								vars: "all",
								varsIgnorePattern: "^_",
								args: "after-used",
								argsIgnorePattern: "^_"
							}
						]
				  }
				: {
						// 🧘 Ignore in dev
						"unused-imports/no-unused-imports": "off",
						"unused-imports/no-unused-vars": "off"
				  })
		}
	}
];

export default eslintConfig;
