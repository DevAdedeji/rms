<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Edit Session</p>
      </template>
      <form class="flex flex-col gap-6" @submit.prevent="handleAddSession">
        <UFormGroup label="Start Date">
          <UInput
            v-model="form.start_date"
            placeholder="Select start date"
            type="date"
            required
          />
        </UFormGroup>
        <UFormGroup label="End Date">
          <UInput
            v-model="form.end_date"
            placeholder="Select end date"
            type="date"
            required
          />
        </UFormGroup>
        <UFormGroup label="Session Name">
          <UInput v-model="form.name" placeholder="Name" required disabled />
        </UFormGroup>
        <div class="flex justify-end">
          <UButton type="submit" class="px-6" :loading="updating">Save</UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const { updating, updateSession } = useUpdateSession();
const toast = useToast();
const model = defineModel({ type: Boolean, default: false });
const props = defineProps<{
  session: any;
}>();
const form = ref({
  id: "",
  name: "",
  start_date: "",
  end_date: "",
  is_active: false,
});
const handleAddSession = async () => {
  const firstDate = new Date(form.value.start_date);
  const secondDate = new Date(form.value.end_date);
  if (secondDate <= firstDate) {
    toast.add({
      title: "Error",
      description: "End date must be after the start date",
      color: "red",
    });
  }
  await updateSession(form.value);
  model.value = false;
  form.value.name = "";
  form.value.start_date = "";
  form.value.end_date = "";
};

watch(
  [() => form.value.end_date, () => form.value.start_date],
  () => {
    if (form.value.start_date && form.value.end_date) {
      const firstDate = new Date(form.value.start_date);
      const secondDate = new Date(form.value.end_date);
      if (secondDate <= firstDate) {
        toast.add({
          title: "Error",
          description: "End date must be after the start date",
          color: "red",
        });
      }
      const yearName = `${firstDate.getFullYear()}/${secondDate.getFullYear()}`;
      form.value.name = yearName;
    }
  },
  { immediate: true },
);

watch(
  () => props.session,
  () => {
    if (props.session) {
      form.value.id = props.session.id;
      form.value.name = props.session.name;
      form.value.start_date = props.session.start_date;
      form.value.end_date = props.session.end_date;
      form.value.is_active = props.session.is_active;
    }
  },
);
</script>
