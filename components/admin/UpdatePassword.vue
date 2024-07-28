<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Update User Password</p>
      </template>
      <form class="flex flex-col gap-6" @submit.prevent="handleUpdatePassword">
        <UFormGroup label="Password">
          <UInput
            v-model="form.password"
            placeholder="********"
            type="password"
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
const emits = defineEmits(["updated"]);
const model = defineModel({ type: Boolean, default: false });

const props = defineProps<{
  userId: String;
}>();

const form = ref({
  password: "",
});

const updating = ref(false);
const handleUpdatePassword = async () => {
  const client = useSupabaseClient();
  const toast = useToast();

  updating.value = true;
  const { data, error } = await client.auth.admin.updateUserById(
    props.userId as string,
    {
      password: form.value.password,
    },
  );
  if (data.user) {
    toast.add({
      title: "Success",
      description: "Password updated successfully",
      icon: "i-heroicons-check-circle",
      color: "green",
    });
    emits("updated");
    model.value = false;
  } else {
    toast.add({
      title: "Error",
      description:
        error?.message || "Couldn't update user password, pls try again later",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
  }
  updating.value = false;
};
</script>
