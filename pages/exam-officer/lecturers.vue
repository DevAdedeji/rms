<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="flex items-center justify-between">
        <UInput
          v-model="q"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          :trailing="false"
          placeholder="Search..."
          class="w-[300px]"
        />
        <UButton
          icon="i-heroicons-plus-solid"
          @click="showAddLecturerModal = true"
          >Add New Lecturer</UButton
        >
      </div>
      <UTable
        :rows="lecturers"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No lecturers added yet!.',
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
    <LazyEditLecturerModal
      v-model="showEditLecturerModal"
      :lecturer="selectedLecturer"
      @updated="lecturerInfoUpdated = true"
    />
    <LazyAddLecturerModal v-model="showAddLecturerModal" />
    <LazyAdminUpdatePassword
      v-if="selectedLecturer"
      v-model="showUpdateLecturerPassword"
      :user-id="selectedLecturer.id"
      @updated="lecturerInfoUpdated = true"
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
const { fetchLecturers } = useLecturers();
const { added } = useAddLecturer();
const { deleteLecturer, deleted } = useDeleteLecturer();

const showAddLecturerModal = ref(false);
const showEditLecturerModal = ref(false);
const showUpdateLecturerPassword = ref(false);
const selectedLecturer = ref<User | null>(null);
const lecturerInfoUpdated = ref(false);
const q = ref("");
const filteredRows = ref<User[]>([]);

const { data, error, pending } = await useAsyncData(
  "lecturers",
  async () => {
    const lecturers = await fetchLecturers();
    added.value = false;
    lecturerInfoUpdated.value = false;
    return lecturers;
  },
  { watch: [added, lecturerInfoUpdated, deleted] },
);

const lecturers = computed(() => data.value);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

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

const openEditModal = (row: User) => {
  selectedLecturer.value = row;
  showEditLecturerModal.value = true;
};

const deleteOfficer = async (id: String) => {
  await deleteLecturer(id);
};

const openUpdatePasswordModal = (row: User) => {
  selectedLecturer.value = row;
  showUpdateLecturerPassword.value = true;
};

const updateFilteredRows = () => {
  if (!q.value && lecturers.value) {
    filteredRows.value = lecturers.value;
  } else if (lecturers.value) {
    filteredRows.value = lecturers.value.filter((lecturer) => {
      return Object.values(lecturer).some((value) => {
        return String(value).toLowerCase().includes(q.value.toLowerCase());
      });
    });
  } else {
    filteredRows.value = [];
  }
};

watch(
  [q],
  () => {
    updateFilteredRows();
  },
  { immediate: true },
);
</script>
