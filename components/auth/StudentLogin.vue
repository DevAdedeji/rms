<template>
  <div class="w-full">
    <form class="flex flex-col gap-6">
      <UFormGroup label="Matric Number">
        <UInput placeholder="191263" icon="i-heroicons-user" />
      </UFormGroup>
      <UFormGroup label="Password">
        <UInput
          type="password"
          placeholder="Enter password"
          icon="i-heroicons-key"
        />
      </UFormGroup>
      <UButton
        type="submit"
        :loading="loading"
        class="flex items-center justify-center"
        >Login</UButton
      >
    </form>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false);
</script>
