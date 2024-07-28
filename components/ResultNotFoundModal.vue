<template>
  <UModal v-model="model">
    <UCard>
      <div class="flex flex-col items-center justify-center gap-6 py-10">
        <UIcon name="i-heroicons-x-circle" class="text-[150px] text-[red]" />
        <div class="flex flex-col gap-3 text-center">
          <h1 class="text-2xl font-bold">Result Not Found!</h1>
          <p class="text-gray-600">
            The result for the selected level and semester was not found, you
            can check back later.
          </p>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const model = defineModel({ type: Boolean, default: false });
</script>
