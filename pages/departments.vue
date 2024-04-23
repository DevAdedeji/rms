<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="flex items-center justify-end">
        <UButton icon="i-heroicons-plus-solid" @click="showAddDeptModal = true"
          >Add Department</UButton
        >
      </div>
      <UTable
        :rows="departments"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No departments found!.',
        }"
      >
        <template #faculty-data="{ row }">
          <p>{{ row.faculty.name }}</p>
        </template>
        <template #actions-data>
          <div class="flex items-center gap-2">
            <UButton>Edit</UButton>
            <UButton color="red">Delete</UButton>
          </div>
        </template>
      </UTable>
    </div>
    <LazyAddDeptModal v-model="showAddDeptModal" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
const toast = useToast();
const { fetchAllDepts } = useDepartments();

const showAddDeptModal = ref(false);
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
    key: "faculty",
    label: "Faculty",
  },
  {
    key: "actions",
  },
];
const { data, error, pending } = await useAsyncData("deparments", async () => {
  const deparments = await fetchAllDepts();
  return deparments;
});

const departments = computed(() => data.value);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}
</script>
