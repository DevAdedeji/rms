<template>
  <UModal v-model="model">
    <UCard>
      <div class="flex flex-col items-center justify-center gap-6 py-10">
        <UIcon name="i-heroicons-x-circle" class="text-[150px] text-[red]" />
        <div class="flex flex-col gap-3 text-center">
          <h1 class="text-2xl font-bold">Result Not Yet Approved!</h1>
          <p class="text-gray-600">
            The results for the selected semester and level are currently under
            review and have not been approved yet. Please check back later for
            updates.
          </p>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const model = defineModel({ type: Boolean, default: false });
</script>
