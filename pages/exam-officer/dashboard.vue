<template>
  <main class="bg-white min-h-screen w-full">
    <div class="flex flex-col gap-6 py-10">Exam officer page</div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
