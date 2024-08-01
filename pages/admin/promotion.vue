<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div
      class="flex flex-col items-center justify-center min-h-[70vh] w-full gap-6 py-10"
    >
      <UButton
        size="xl"
        class="px-6 py-6 text-2xl"
        :loading="promoting"
        :disabled="promoting"
        @click="promoteStudents"
        >Promote Students</UButton
      >
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { promoteStudents, promoting } = usePromoteStudents();
</script>
