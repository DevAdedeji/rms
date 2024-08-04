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
          <UButton
            icon="i-heroicons-plus-solid"
            @click="showAddCourseModal = true"
            >Add New Course</UButton
          >
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
      >
        <template #index-data="{ index }">
          <p>{{ index + 1 }}</p>
        </template>
        <template #lecturer-data="{ row }">
          <p v-if="row.lecturer">
            {{ row.lecturer.first_name + " " + row.lecturer.last_name }}
          </p>
          <p v-else>N/A</p>
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
    <LazyAddCourseModal v-model="showAddCourseModal" />
    <LazyEditCourseModal
      v-model="showEditCourseModal"
      :course="selectedCourse"
      @updated="refresh"
    />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { fetchCourses } = useCourses();
const { added } = useAddCourse();
const { deleteCourse, deleted } = useDeleteCourse();
const toast = useToast();

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
    key: "lecturer",
    label: "Lecturer",
  },
  {
    key: "actions",
  },
];
const items = (row: any) => [
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
      click: async () => {
        await deleteCourse(row.id);
      },
    },
  ],
];
const showAddCourseModal = ref(false);
const showEditCourseModal = ref(false);
const selectedCourse = ref<any>({});

const openEditModal = (row: any) => {
  showEditCourseModal.value = true;
  selectedCourse.value = row;
};
const q = ref("");
const levelFilterOptions = ref(["All", "100", "200", "300", "400", "500"]);
const levelSelected = ref(null);
const semesterFilterOptions = ref(["All", "harmattan", "rain"]);
const semesterSelected = ref(null);

const { data, error, pending, refresh } = await useAsyncData(
  "courses",
  async () => {
    const courses = await fetchCourses();
    added.value = false;
    return courses;
  },
  { watch: [added, deleted] },
);

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
