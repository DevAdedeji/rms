<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="flex items-center justify-end">
        <UButton
          icon="i-heroicons-plus-solid"
          @click="showAddFacultyModal = true"
          >Add Faculty</UButton
        >
      </div>
      <UTable
        :rows="faculties"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No faculties found!.',
        }"
      >
        <template #actions-data>
          <div class="flex items-center gap-2">
            <UButton>Edit</UButton>
            <UButton color="red">Delete</UButton>
          </div>
        </template>
      </UTable>
    </div>
    <LazyAddFacultyModal v-model="showAddFacultyModal" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
const toast = useToast();
const { fetchAllFaculties } = useFaculties();
const showAddFacultyModal = ref(false);
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "actions",
  },
];

const { data, error, pending } = await useAsyncData("faculties", async () => {
  const faculties = await fetchAllFaculties();
  return faculties;
});

const faculties = computed(() => data.value);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}
</script>
