// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    "overrides": [
      {
        "files": ["*.ts", "*.tsx"],
        "rules": {
          "react-native/no-inline-styles": "off"
        }
      }
    ]
  }
  
]);
