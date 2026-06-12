import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: node({ mode: 'middleware' }),
  integrations: [tailwind(), icon()]
});