<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="grid grid-cols-3 gap-6">
        <UCard
          v-for="summary in summaries"
          :key="summary.label"
          class="!bg-black-100"
        >
          <div class="flex flex-col gap-8 justify-between">
            <p class="text-4xl font-bold">{{ summary.count }}</p>
            <p class="text-md">{{ summary.label }}</p>
          </div>
        </UCard>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const summaries = ref([
  {
    count: 20000,
    label: "No. of students",
  },
  {
    count: 20000,
    label: "No. of faculties",
  },
  {
    count: 20000,
    label: "No. of departments",
  },
]);
</script>
