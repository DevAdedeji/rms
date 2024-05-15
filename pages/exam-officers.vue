<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="flex items-center justify-end">
        <UButton
          icon="i-heroicons-plus-solid"
          @click="showAddExamOfficerModal = true"
          >Add Exam Officer</UButton
        >
      </div>
    </div>
    <LazyAddExamOfficer v-model="showAddExamOfficerModal" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const showAddExamOfficerModal = ref(false);
</script>
