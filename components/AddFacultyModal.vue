<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Add New Faculty</p>
      </template>
      <form class="flex flex-col gap-6" @submit.prevent="createFaculty">
        <UFormGroup label="Faculty Name">
          <UInput
            v-model="form.name"
            placeholder="Enter faculty name"
            required
          />
        </UFormGroup>
        <div class="flex justify-end">
          <UButton type="submit" class="px-6" :loading="adding">Save</UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const emits = defineEmits(["added"]);
const model = defineModel({ type: Boolean, default: false });
const { adding, added, addFaculty } = useAddFaculty();
const form = ref({
  name: "",
});
const createFaculty = async () => {
  await addFaculty(form.value);
  model.value = false;
  form.value = {
    name: "",
  };
};
watch(added, () => {
  emits("added");
});
</script>
