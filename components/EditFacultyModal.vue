<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Edit Faculty</p>
      </template>
      <form class="flex flex-col gap-6" @submit.prevent="saveFaculty">
        <UFormGroup label="Faculty Name">
          <UInput
            v-model="form.name"
            placeholder="Enter faculty name"
            required
          />
        </UFormGroup>
        <div class="flex justify-end">
          <UButton type="submit" class="px-6" :loading="updating">Save</UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { type facultyType } from "~/types/faculty";
const emits = defineEmits(["updated"]);
const props = defineProps<{
  faculty: facultyType | null;
}>();
const model = defineModel({ type: Boolean, default: false });
const { updateFaculty, updated, updating } = useUpdateFaculty();
const form = ref<facultyType>({
  id: "",
  name: "",
});
const saveFaculty = async () => {
  await updateFaculty(form.value);
  model.value = false;
  form.value = {
    name: "",
    id: "",
  };
};
watch(updated, () => {
  emits("updated");
});

watch(
  () => props.faculty,
  () => {
    if (props.faculty) {
      form.value.id = props.faculty.id;
      form.value.name = props.faculty.name;
    }
  },
  { immediate: true },
);
</script>
