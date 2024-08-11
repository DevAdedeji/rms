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
          placeholder="Search course"
          class="w-2/5"
        />
        <div class="flex items-center gap-6">
          <USelectMenu
            v-model="levelSelected"
            :options="levelFilterOptions"
            placeholder="Filter by Level"
          />
          <USelectMenu
            v-model="semesterSelected"
            :options="semesterFilterOptions"
            placeholder="Filter by semester"
          />
        </div>
      </div>
      <UTable
        :rows="filteredRows"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No Courses found!.',
        }"
        @select="openStudentsPage"
      >
        <template #index-data="{ index }">
          <p>{{ index + 1 }}</p>
        </template>
      </UTable>
    </div>
    <SessionsList v-model="showSessionsListModal" @selected="sessionSelected" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { fetchCourses } = useLecturerCourses();
const toast = useToast();
const router = useRouter();
const columns = [
  {
    key: "index",
    label: "S/N",
  },
  {
    key: "course_code",
    label: "Course Code",
  },
  {
    key: "title",
    label: "Title",
  },
  {
    key: "unit",
    label: "Unit",
  },
  {
    key: "level",
    label: "Level",
  },
  {
    key: "semester",
    label: "Semester",
  },
  {
    key: "actions",
  },
];

const q = ref("");
const levelFilterOptions = ref(["All", "100", "200", "300", "400", "500"]);
const levelSelected = ref(null);
const semesterFilterOptions = ref(["All", "harmattan", "rain"]);
const semesterSelected = ref(null);

const { data, error, pending } = await useAsyncData("courses", async () => {
  const courses = await fetchCourses();
  return courses;
});

const courses = computed(() => data.value);
const filteredRows = ref<any>([]);

if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const updateFilteredRows = () => {
  if (!q.value && courses.value) {
    filteredRows.value = courses.value;
  } else if (courses.value) {
    filteredRows.value = courses.value.filter((course: any) => {
      return Object.values(course).some((value) => {
        return String(value).toLowerCase().includes(q.value.toLowerCase());
      });
    });
  } else {
    filteredRows.value = [];
  }
};

const showSessionsListModal = ref(false);
const selectedSession = ref<any>({});
const selectedCourse = ref<any>({});
const sessionSelected = (session: any) => {
  selectedSession.value = session;
  showSessionsListModal.value = false;
  router.push(
    `/lecturer/courses/${selectedCourse.value.id}/students?session_id=${selectedSession.value.id}`,
  );
};

const openStudentsPage = (row: any) => {
  showSessionsListModal.value = true;
  selectedCourse.value = row;
};

watch(
  [q, courses],
  () => {
    updateFilteredRows();
  },
  { immediate: true },
);

watch(levelSelected, () => {
  if (courses.value && levelSelected.value) {
    if (levelSelected.value === "All") {
      filteredRows.value = courses.value;
    } else if (semesterSelected.value) {
      filteredRows.value = courses.value.filter(
        (course: any) =>
          course.level === levelSelected.value &&
          course.semester === semesterSelected.value,
      );
    } else {
      filteredRows.value = courses.value.filter(
        (course: any) => course.level === levelSelected.value,
      );
    }
  }
});

watch(semesterSelected, () => {
  if (courses.value && semesterSelected.value) {
    if (semesterSelected.value === "All") {
      filteredRows.value = courses.value;
    } else if (levelSelected.value) {
      filteredRows.value = courses.value.filter(
        (course: any) =>
          course.semester === semesterSelected.value &&
          course.level === levelSelected.value,
      );
    } else {
      filteredRows.value = filteredRows.value.filter(
        (course: any) => course.semester === semesterSelected.value,
      );
    }
  }
});
</script>
