<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 w-4/5">
          <UInput
            v-model="q"
            icon="i-heroicons-magnifying-glass-20-solid"
            size="sm"
            color="white"
            :trailing="false"
            placeholder="Search..."
            class="w-[300px]"
          />
          <USelectMenu
            v-model="facultySelected"
            :options="faculties"
            placeholder="Filter by faculty"
            option-attribute="name"
            class="w-[200px]"
          >
            <template #option="{ option: faculty }">
              <span class="truncate">{{ faculty.name }}</span>
            </template>
          </USelectMenu>
          <USelectMenu
            v-model="deptSelected"
            :options="departments"
            placeholder="Filter by department"
            option-attribute="name"
            :loading="searching"
            class="w-[200px]"
          >
            <template #option="{ option: dept }">
              <span class="truncate">{{ dept.name }}</span>
            </template>
            <template #empty>
              <p>Select faculty first</p>
            </template>
          </USelectMenu>
        </div>
        <UButton icon="i-heroicons-plus-solid" @click="showAddHODModal = true"
          >Add New HOD</UButton
        >
      </div>
      <UTable
        :rows="filteredRows"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No HOD(s) found!.',
        }"
      >
        <template #index-data="{ index }">
          <p>{{ index + 1 }}</p>
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
    <LazyAdminEditHOD
      v-model="showEditHODModal"
      :headof-department="selectedHOD"
      @updated="HODInfoUpdated = true"
    />
    <LazyAdminAddNewHOD v-model="showAddHODModal" />
    <LazyAdminUpdatePassword
      v-if="selectedHOD"
      v-model="showUpdateHODPassword"
      :user-id="selectedHOD.id"
      @updated="HODInfoUpdated = true"
    />
  </main>
</template>

<script setup lang="ts">
import { type departmentType } from "~/types/department";
import { type facultyType } from "~/types/faculty";
import { type User } from "~/types/auth/user";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { fetchAllFaculties } = useFaculties();
const { fetchDepartmentsByFacultyId } = useDepartments();
const { fetchAllHODs } = useHODs();
const { deleteHOD, deleted } = useDeleteHOD();
const { added } = useAddHOD();
const toast = useToast();

const columns = [
  {
    key: "index",
    label: "S/N",
  },
  {
    key: "first_name",
    label: "First Name",
  },
  {
    key: "last_name",
    label: "Last Name",
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
const showAddHODModal = ref(false);
const showEditHODModal = ref(false);
const showUpdateHODPassword = ref(false);
const selectedHOD = ref<User | null>(null);
const HODInfoUpdated = ref(false);

const openEditModal = (row: User) => {
  selectedHOD.value = row;
  showEditHODModal.value = true;
};

const openUpdatePasswordModal = (row: User) => {
  selectedHOD.value = row;
  showUpdateHODPassword.value = true;
};

const deleteOfficer = async (id: String) => {
  await deleteHOD(id);
};

const { data, error, pending } = await useAsyncData(
  "headOfDepartments",
  async () => {
    const headOfDepartments = await fetchAllHODs();
    return headOfDepartments;
  },
  { watch: [HODInfoUpdated, deleted, added] },
);

const headOfDepartments = computed(() => data.value);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const faculties = ref<facultyType[]>([
  {
    id: "all",
    name: "All",
  },
]);
const departments = ref<departmentType[]>([]);
const facultySelected = ref();
const deptSelected = ref();
const searching = ref(false);
const q = ref("");
const filteredRows = ref<User[]>([]);
const getFaculties = async () => {
  const data = await fetchAllFaculties();
  faculties.value.push(...data);
};
const getDepartments = async () => {
  try {
    searching.value = true;
    const data = await fetchDepartmentsByFacultyId(facultySelected.value.id);
    departments.value = data;
  } catch (e) {
    // console.log(e);
  } finally {
    searching.value = false;
  }
};

const updateFilteredRows = () => {
  if (!q.value && headOfDepartments.value) {
    filteredRows.value = headOfDepartments.value;
  } else if (headOfDepartments.value) {
    filteredRows.value = headOfDepartments.value.filter((hod) => {
      return Object.values(hod).some((value) => {
        return String(value).toLowerCase().includes(q.value.toLowerCase());
      });
    });
  } else {
    filteredRows.value = [];
  }
};

watch(facultySelected, async () => {
  if (facultySelected.value && facultySelected.value.id === "all") {
    if (headOfDepartments.value) {
      filteredRows.value = headOfDepartments.value;
    }
    return;
  }
  const rows = headOfDepartments.value;
  if (rows) {
    const data = rows.filter(
      (row) => row.faculty?.id === facultySelected.value.id,
    );
    if (data) {
      filteredRows.value = data;
    }
    deptSelected.value = null;
    await getDepartments();
  }
});

watch(deptSelected, () => {
  if (deptSelected.value) {
    const rows = headOfDepartments.value;
    if (rows) {
      const data = rows.filter(
        (row) => row.department?.id === deptSelected.value.id,
      );
      if (data) {
        filteredRows.value = data;
      }
    }
  }
});

watch(
  [q, headOfDepartments],
  () => {
    updateFilteredRows();
  },
  { immediate: true },
);

onMounted(() => {
  getFaculties();
});
</script>
