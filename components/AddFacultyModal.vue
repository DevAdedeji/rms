<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Add New Faculty</p>
      </template>
      <form class="flex flex-col gap-6">
        <UFormGroup label="Faculty Name">
          <UInput placeholder="Enter faculty name" />
        </UFormGroup>
        <div class="flex justify-end">
          <UButton class="px-6">Save</UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const model = defineModel({ type: Boolean, default: false });
</script>
