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
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>
    </div>
    <LazyAdminEditExamOfficer
      v-model="showEditExamOfficerModal"
      :exam-officer="selectedExamOfficer"
      @updated="examOfficerInfoUpdated = true"
    />
    <LazyAdminAddExamOfficer v-model="showAddExamOfficerModal" />
    <LazyAdminUpdatePassword
      v-if="selectedExamOfficer"
      v-model="showUpdateExamOfficerPassword"
      :user-id="selectedExamOfficer.id"
      @updated="examOfficerInfoUpdated = true"
    />
  </main>
</template>

<script setup lang="ts">
import { type User } from "~/types/auth/user";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const toast = useToast();
const { fetchExamOfficers } = useExamOfficers();
const { added } = useAddExamOfficer();
const { deleteExamOfficer, deleted } = useDeleteExamOfficer();
const showAddExamOfficerModal = ref(false);
const showEditExamOfficerModal = ref(false);
const showUpdateExamOfficerPassword = ref(false);
const selectedExamOfficer = ref<User | null>(null);
const examOfficerInfoUpdated = ref(false);

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

const items = (row: User) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        openEditModal(row);
      },
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        deleteOfficer(row.id);
      },
    },
    {
      label: "Update Password",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        openUpdatePasswordModal(row);
      },
    },
  ],
];

const officers = ref<User[]>([]);

const openEditModal = (row: any) => {
  selectedExamOfficer.value = row;
  showEditExamOfficerModal.value = true;
};
const deleteOfficer = async (id: String) => {
  await deleteExamOfficer(id);
};
const openUpdatePasswordModal = (row: User) => {
  selectedExamOfficer.value = row;
  showUpdateExamOfficerPassword.value = true;
};

const { data, error, pending } = await useAsyncData(
  "exam_officers",
  async () => {
    const officers = await fetchExamOfficers();
    added.value = false;
    examOfficerInfoUpdated.value = false;
    return officers;
  },
  { watch: [added, examOfficerInfoUpdated, deleted] },
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
