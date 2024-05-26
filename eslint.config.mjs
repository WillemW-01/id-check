// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactnative from "eslint-plugin-react-native";

export default [
  js.configs.recommended,

  {
    plugins: {
      react,
      reactnative,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
