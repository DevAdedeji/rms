<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Add New Department</p>
      </template>
      <form class="flex flex-col gap-6">
        <UFormGroup label="Select Faculty">
          <USelectMenu v-model="selected" :options="people" />
        </UFormGroup>
        <UFormGroup label="Department Name">
          <UInput placeholder="Enter department name" />
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
const people = [
  "Wade Cooper",
  "Arlene Mccoy",
  "Devon Webb",
  "Tom Cook",
  "Tanya Fox",
  "Hellen Schmidt",
  "Caroline Schultz",
  "Mason Heaney",
  "Claudie Smitham",
  "Emil Schaefer",
];
const selected = ref(people[0]);
</script>
