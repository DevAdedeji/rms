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
          placeholder="Search student"
          class="w-2/5"
        />
        <div class="w-2/5 grid grid-cols-2 gap-3">
          <USelectMenu
            v-model="facultySelected"
            :options="faculties"
            placeholder="Filter by faculty"
            option-attribute="name"
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
          >
            <template #option="{ option: dept }">
              <span class="truncate">{{ dept.name }}</span>
            </template>
            <template #empty>
              <p>Select faculty first</p>
            </template>
          </USelectMenu>
        </div>
      </div>
      <UTable
        :rows="filteredRows"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No Students found!.',
        }"
        @select="openStudentPage"
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
        <template #cert-data="{ row }">
          <p>{{ row.cert.name }}</p>
        </template>
      </UTable>
    </div>
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
const { fetchAllStudents } = useStudents();
const { fetchAllFaculties } = useFaculties();
const { fetchDepartmentsByFacultyId } = useDepartments();
const toast = useToast();
const router = useRouter();

const columns = [
  {
    key: "index",
    label: "S/N",
  },
  {
    key: "matric_no",
    label: "Matric No.",
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
    key: "level",
    label: "Level",
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
    key: "cert",
    label: "Certificate",
  },
];

const { data, error, pending } = await useAsyncData("students", async () => {
  const students = await fetchAllStudents();
  return students;
});

const students = computed(() => data.value);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const q = ref("");

const filteredRows = ref<User[]>([]);

const updateFilteredRows = () => {
  if (!q.value && students.value) {
    filteredRows.value = students.value;
  } else if (students.value) {
    filteredRows.value = students.value.filter((student) => {
      return Object.values(student).some((value) => {
        return String(value).toLowerCase().includes(q.value.toLowerCase());
      });
    });
  } else {
    filteredRows.value = [];
  }
};

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
    console.log(e);
  } finally {
    searching.value = false;
  }
};

const openStudentPage = (student: User) => {
  router.push(`/student/${student.id}`);
};

watch(facultySelected, async () => {
  if (facultySelected.value && facultySelected.value.id === "all") {
    if (students.value) {
      filteredRows.value = students.value;
    }
    return;
  }
  const rows = students.value;
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
    const rows = students.value;
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
  [q, students],
  () => {
    updateFilteredRows();
  },
  { immediate: true },
);

onMounted(() => {
  getFaculties();
});
</script>
