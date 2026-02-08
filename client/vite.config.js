import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import postcss from "postcss";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [tailwindcss(), postcss(), react()],
    define: {
      "process.env.FRONTEND": JSON.stringify(env.FRONTEND),
      "process.env.BACKEND": JSON.stringify(env.BACKEND),
      "process.env.CLIENT_ID": JSON.stringify(env.CLIENT_ID),
    },
    server: {
      proxy: {
        "/api": {
          target: env.BACKEND || "http://localhost:5000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
