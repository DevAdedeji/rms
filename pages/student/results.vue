<template>
  <main class="bg-white min-h-screen w-full">
    <div class="flex">
      <h1>Student Results page</h1>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
