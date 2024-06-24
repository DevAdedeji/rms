<template>
  <main class="bg-white min-h-screen w-full pr-5"></main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
