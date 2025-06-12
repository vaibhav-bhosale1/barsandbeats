// .eslintrc.js
module.exports = {
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    'no-console': 'off',
    'react-hooks/exhaustive-deps': 'off',
    // Add other rules you want to disable
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  ,
  "ignorePatterns": [
    "lib/generated/**/*",
    "prisma/generated/**/*",
    "node_modules/**/*",
    ".next/**/*"
  ]
  },
};
