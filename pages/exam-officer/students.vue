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
        <div class="flex items-center gap-6">
          <USelectMenu
            v-model="levelSelected"
            :options="levelFilterOptions"
            placeholder="Filter by Level"
          />
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
      </UTable>
    </div>
  </main>
</template>

<script setup lang="ts">
import { type User } from "~/types/auth/user";
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const toast = useToast();
const router = useRouter();
const { fetchExamOfficerStudent } = useExamOfficers();

const q = ref("");
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
];
const levelFilterOptions = ref(["All", "100", "200", "300", "400", "500"]);
const levelSelected = ref(null);

const { data, error, pending } = await useAsyncData("students", async () => {
  const students = await fetchExamOfficerStudent();
  return students;
});
const students = computed(() => data.value);
const filteredRows = ref<User[]>([]);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

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

const openStudentPage = (student: User) => {
  router.push(`/student/info/${student.id}`);
};

watch(
  [q, students],
  () => {
    updateFilteredRows();
  },
  { immediate: true },
);

watch(levelSelected, () => {
  if (students.value && levelSelected.value) {
    if (levelSelected.value === "All") {
      filteredRows.value = students.value;
    } else {
      filteredRows.value = students.value.filter(
        (student: User) => student.level === levelSelected.value,
      );
    }
  }
});
</script>
