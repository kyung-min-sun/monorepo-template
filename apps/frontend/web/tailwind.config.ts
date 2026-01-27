import type { Config } from "tailwindcss";
import sharedConfig from "@project-template/tailwind-config";

export default {
  content: ["./src/**/*.tsx"],
  presets: [sharedConfig],
} satisfies Config;
