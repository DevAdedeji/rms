<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="flex items-center justify-between">
        <USelectMenu
          v-model="facultySelected"
          :options="faculties"
          placeholder="Filter by faculty"
          option-attribute="name"
          class="w-1/5"
        >
          <template #option="{ option: faculty }">
            <span class="truncate">{{ faculty.name }}</span>
          </template>
        </USelectMenu>
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
        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton @click="openEditModal(row)">Edit</UButton>
            <UButton color="red" @click="deleteDepartment(row.id)"
              >Delete</UButton
            >
          </div>
        </template>
      </UTable>
    </div>
    <LazyAddDeptModal v-model="showAddDeptModal" @added="newDeptAdded = true" />
    <LazyEditDeptModal
      v-model="showEditDeptModal"
      :department="selectedDepartment"
      @updated="deptUpdated = true"
    />
  </main>
</template>

<script setup lang="ts">
import type { departmentType } from "~/types/department";
import { type facultyType } from "~/types/faculty";
definePageMeta({
  layout: "dashboard",
});
const toast = useToast();
const { fetchAllDepts } = useDepartments();
const { fetchAllFaculties } = useFaculties();
const { deleted, deleteDepartment } = useDeleteDepartment();

const showAddDeptModal = ref(false);
const showEditDeptModal = ref(false);
const newDeptAdded = ref(false);
const deptUpdated = ref(false);
const selectedDepartment = ref<departmentType | null>(null);
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

const { data, error, pending } = await useAsyncData(
  "deparments",
  async () => {
    const deparments = await fetchAllDepts();
    newDeptAdded.value = false;
    deptUpdated.value = false;
    return deparments;
  },
  { watch: [newDeptAdded, deleted, deptUpdated] },
);

const departments = ref<departmentType[]>([]);

watch(
  data,
  () => {
    if (data.value) {
      departments.value = data.value;
    }
  },
  { immediate: true },
);

if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const openEditModal = (data: departmentType) => {
  showEditDeptModal.value = true;
  selectedDepartment.value = data;
};

const faculties = ref<facultyType[]>([
  {
    id: "all",
    name: "All",
  },
]);
const facultySelected = ref();

watch(facultySelected, () => {
  if (facultySelected.value && facultySelected.value.id === "all") {
    if (data.value) {
      departments.value = data.value;
    }
    return;
  }
  if (facultySelected.value && data.value) {
    const departmentsByFaculty = data.value.filter(
      (dept) => dept.faculty?.id === facultySelected.value?.id,
    );
    if (departmentsByFaculty.length) {
      departments.value = departmentsByFaculty;
    } else {
      departments.value = [];
    }
  } else if (data.value) {
    departments.value = data.value;
  }
});

const getFaculties = async () => {
  const data = await fetchAllFaculties();
  faculties.value.push(...data);
};
onMounted(() => {
  getFaculties();
});
</script>
