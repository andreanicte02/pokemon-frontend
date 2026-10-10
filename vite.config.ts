import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
   // En GitHub Pages la app vive en /<repo>/: el workflow de deploy pasa VITE_BASE_PATH.
   base: process.env.VITE_BASE_PATH ?? "/",
   plugins: [react()],
   server: {
      port: 5173,
   },
   build: {
      sourcemap: false,
   },
});
