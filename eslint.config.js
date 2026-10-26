// @ts-check
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    ignores: ["projects/**/*", "dist/**/*", "coverage/**/*"],
  },
  {
    files: ["**/*.ts"],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      // Angular 22 makes OnPush the default and flags components that opt out.
      // The `change-detection-eager` migration added `ChangeDetectionStrategy.Eager`
      // (the renamed `Default`) to preserve each component's pre-v22 CheckAlways
      // behaviour. Moving these event- and async-driven components to OnPush is a
      // behaviour change of its own, not part of the version climb. Re-enable the
      // rule in that change.
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
      "@angular-eslint/prefer-standalone": "error",
      "@angular-eslint/prefer-inject": "error",
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  },
);
