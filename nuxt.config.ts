// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  colorMode: {
    preference: "light",
  },
  css: ["/assets/css/main.css"],
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "@vueuse/nuxt"],
  runtimeConfig: {
    public: {
      frontendBaseUrl:
        process.env.NODE_ENV === "production"
          ? "https://kanban-dun.vercel.app"
          : "http://localhost:8080",
    },
  },
  imports: {
    dirs: [
      "composables",
      "composables/*/index.{ts,js,mjs,mts}",
      "composables/**",
    ],
  },
  supabase: {
    redirect: false,
  },
});
