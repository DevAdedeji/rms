<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div v-if="!pending && student" class="flex flex-col py-10 gap-10">
      <div
        class="flex flex-col items-center gap-3 text-center border border-gray-300 rounded-md p-4 cover-bg"
      >
        <UAvatar :alt="name" size="3xl" class="!border !border-gray-300" />
        <div class="flex flex-col gap-2">
          <p class="text-2xl">{{ name }}</p>
          <p>Matric Number: {{ student.matric_no }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-3 bg-[#DDF9FD] p-4 w-1/3 font-bold">
        <p class="text-[#09A5BE]">
          <span class="text-[#000000]">Level:</span> {{ session.level }}L
        </p>
        <p class="capitalize text-[#09A5BE]">
          <span class="text-[#000000]">Semester:</span>
          {{ session.semester }} semester
        </p>
        <p
          v-if="resultFound || resultSaved"
          class="capitalize text-[#09A5BE] flex items-center gap-1"
        >
          <span class="text-[#000000]">Approval:</span>
          <span
            class="px-2 py-[2px] rounded"
            :class="
              resultApproved
                ? 'bg-[#D1FFD1] text-[#008000]'
                : 'bg-[#FCE3EA] text-[#ED4C78]'
            "
          >
            {{ resultApproved ? "Approved" : "Unapproved" }}
          </span>
        </p>
      </div>
      <UTable :rows="courses" :loading="fetchingCourses" :columns="columns">
        <template #sn-data="{ index }">
          <p>{{ index + 1 }}</p>
        </template>
        <template #course_code-data="{ row }">
          <p>{{ row.course.course_code }}</p>
        </template>
        <template #course_title-data="{ row }">
          <p>{{ row.course.title }}</p>
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
          <UInput v-model="row.grade" disabled class="w-[50px]" />
        </template>
        <template #point-data="{ row }">
          <UInput v-model="row.point" disabled class="w-[50px]" />
        </template>
      </UTable>
      <div v-if="resultFormatted || (isAdmin && resultFound)">
        <p class="text-2xl font-semibold text-gray-600 capitalize pb-2">
          {{ session.semester }} Semester Result
        </p>
        <div class="w-1/2">
          <UTable :rows="[result]" :columns="semesterResultColumn" />
        </div>
        <div v-if="!isAdmin" class="flex items-center justify-end">
          <UButton class="mt-10 px-6 py-4"> Save Result </UButton>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const { fetchStudentById } = useStudent();
const { calculateGrade, calculatePoint } = useCalculator();
const toast = useToast();
const route = useRoute();
const { getUser } = useUser();
// const router = useRouter();
const studentId = route.params.id as string;

const { data, error, pending } = await useAsyncData(
  "a student result",
  async () => {
    const student = await fetchStudentById(studentId);
    return student;
  },
);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const student = computed(() => data.value);
const user = getUser();
const isAdmin = computed(() => user.role === "school_admin");

const name = computed(() =>
  student.value
    ? student.value.first_name + " " + student.value.last_name
    : "Jane Doe",
);

const columns = [
  {
    key: "sn",
    label: "S/N",
  },
  {
    key: "course_code",
    label: "Course Code",
  },
  {
    key: "course_title",
    label: "Course Title",
  },
  {
    key: "unit",
    label: "Course Unit",
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

const semesterResultColumn = [
  {
    key: "total_point_scored",
    label: "Point",
  },
  {
    key: "total_unit",
    label: "Unit",
  },
  {
    key: "gpa",
    label: "GPA",
  },
  {
    key: "class",
    label: "Class",
  },
];

const session = ref({
  level: "",
  semester: "",
});

const courses = ref([]);
const fetchingCourses = ref(true);

const handleScoreChange = (row: any) => {
  row.grade = calculateGrade(row.score);
  row.point = calculatePoint(row.grade, row.unit);
  resultFormatted.value = false;
};

const result = ref<any>({});
const resultFound = ref(false);
const resultFormatted = ref(false);
const resultSaved = ref(false);
const resultApproved = ref(false);

const getDetails = () => {
  session.value.level = route.query.level as string;
  session.value.semester = route.query.semester as string;
};

watch(
  () => route,
  async () => {
    await getDetails();
  },
  { immediate: true },
);
</script>

<style scoped>
.cover-bg {
  background-image: url("../../../../assets/images/cover.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
