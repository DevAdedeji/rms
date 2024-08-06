<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <UCard v-if="course" class="w-1/2">
        <div class="flex flex-col gap-3">
          <p><span class="font-semibold">Title:</span> {{ course.title }}</p>
          <p>
            <span class="font-semibold">Code:</span> {{ course.course_code }}
          </p>
          <p><span class="font-semibold">Unit:</span> {{ course.unit }}</p>
          <p><span class="font-semibold">Level:</span> {{ course.level }}</p>
          <p>
            <span class="font-semibold">Semester:</span> {{ course.semester }}
          </p>
        </div>
      </UCard>
      <div>
        <UInput
          v-model="q"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          :trailing="false"
          placeholder="Search student"
          class="w-2/5"
        />
      </div>
      <UTable
        :rows="filteredRows"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No Students found!.',
        }"
      >
        <template #index-data="{ index }">
          <p>{{ index + 1 }}</p>
        </template>
        <template #matric_no-data="{ row }">
          <p>{{ row.student.matric_no }}</p>
        </template>
        <template #name-data="{ row }">
          <p>{{ row.student.first_name + " " + row.student.last_name }}</p>
        </template>
        <template #score-data="{ row }">
          <UInput
            v-model="row.score"
            class="w-[60px]"
            min="0"
            max="100"
            type="number"
            @keyup="handleScoreChange(row)"
          />
        </template>
        <template #grade-data="{ row }">
          <p>{{ row.grade ? row.grade : "N/A" }}</p>
        </template>
      </UTable>
      <div class="flex justify-end">
        <UButton
          class="py-4 px-6"
          :loading="saving"
          :disabled="saving"
          @click="handleSaveStudentsScores"
        >
          Save
        </UButton>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const route = useRoute();
const toast = useToast();
const courseId = route.params.id as string;
const { fetchCourseStudents, saveCoursesStudentsScores } = useCourseStudents();
const { calculateGrade, calculatePoint } = useCalculator();

const { data, error, pending, refresh } = await useAsyncData(
  "students",
  async () => {
    const students = await fetchCourseStudents(courseId);
    return students;
  },
);
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
    key: "name",
    label: "Name",
  },
  {
    key: "unit",
    label: "Unit",
  },
  {
    key: "score",
    label: "Score",
  },
  {
    key: "grade",
    label: "Grade",
  },
  {
    key: "point",
    label: "Point",
  },
];
const students = computed(() => data.value);
const course = ref<any>(null);
const filteredRows = ref<any[]>([]);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}
const q = ref("");
const updateFilteredRows = () => {
  if (!q.value && students.value) {
    filteredRows.value = students.value;
  } else if (students.value) {
    filteredRows.value = students.value.filter((student: any) => {
      return (
        student.student.matric_no.includes(q.value) ||
        student.student.first_name
          .toLowerCase()
          .includes(q.value.toLowerCase()) ||
        student.student.last_name.toLowerCase().includes(q.value.toLowerCase())
      );
    });
  } else {
    filteredRows.value = [];
  }
};

watch(
  [q, students],
  () => {
    updateFilteredRows();
    if (students.value && students.value.length) {
      course.value = students.value[0].course;
    }
  },
  { immediate: true },
);

const handleScoreChange = (row: any) => {
  row.grade = calculateGrade(row.score);
  row.point = calculatePoint(row.grade, row.unit);
};

const saving = ref(false);
const handleSaveStudentsScores = async () => {
  saving.value = true;
  const saved = await saveCoursesStudentsScores(students.value);
  if (saved) {
    refresh();
  }
  saving.value = false;
};
</script>
