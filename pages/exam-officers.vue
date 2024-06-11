<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="flex items-center justify-end">
        <UButton
          icon="i-heroicons-plus-solid"
          @click="showAddExamOfficerModal = true"
          >Add Exam Officer</UButton
        >
      </div>
      <UTable
        :rows="officers"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No exam officers added yet!.',
        }"
      >
        <template #sn-data="{ index }">
          <p>{{ index + 1 }}</p>
        </template>
        <template #name-data="{ row }">
          <p>{{ row.first_name + " " + row.last_name }}</p>
        </template>
        <template #faculty-data="{ row }">
          <p>{{ row.faculty.name }}</p>
        </template>
        <template #department-data="{ row }">
          <p>{{ row.department.name }}</p>
        </template>
        <template #actions-data="{}">
          <div class="flex items-center gap-2">
            <UButton @click="openEditModal">Edit</UButton>
            <UButton color="red" @click="deleteOfficer">Delete</UButton>
          </div>
        </template>
      </UTable>
    </div>
    <LazyAddExamOfficer v-model="showAddExamOfficerModal" />
  </main>
</template>

<script setup lang="ts">
import { type User } from "~/types/auth/user";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const toast = useToast();
const { fetchExamOfficers, added } = useExamOfficers();
const showAddExamOfficerModal = ref(false);
const columns = [
  {
    key: "sn",
    label: "S/N",
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
    key: "department",
    label: "Department",
  },
  {
    key: "actions",
  },
];

const officers = ref<User[]>([]);

const openEditModal = () => {
  //
};
const deleteOfficer = () => {
  //
};

const { data, error, pending } = await useAsyncData(
  "exam_officers",
  async () => {
    const officers = await fetchExamOfficers();
    added.value = false;
    return officers;
  },
  { watch: [added] },
);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

watch(
  data,
  () => {
    if (data.value) {
      officers.value = data.value;
    }
  },
  { immediate: true },
);
</script>
