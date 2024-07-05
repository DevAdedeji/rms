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
              result.approved
                ? 'bg-[#D1FFD1] text-[#008000]'
                : 'bg-[#FCE3EA] text-[#ED4C78]'
            "
          >
            {{ result.approved ? "Approved" : "Unapproved" }}
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
      <div v-if="resultFormatted">
        <p class="text-2xl font-semibold text-gray-600 capitalize pb-2">
          {{ session.semester }} Semester Result
        </p>
        <div class="w-1/2">
          <UTable :rows="[result]" :columns="semesterResultColumn" />
        </div>
        <div class="flex items-center justify-end">
          <UButton
            class="mt-10 px-6 py-4"
            :loading="savingResult"
            @click="handleSaving"
          >
            Save Result
          </UButton>
        </div>
      </div>
      <UButton
        v-if="!resultFormatted"
        class="ml-auto self-start px-6 py-4"
        @click="handleFormatCoursesAsResult"
        >Update</UButton
      >
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const {
  fetchStudentById,
  fetchStudentCourseBySession,
  fetchStudentResult,
  saveStudentResult,
} = useStudent();
const { calculateGrade, calculatePoint, calculateClass } = useCalculator();
const toast = useToast();
const route = useRoute();
// const { getUser } = useUser();
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
const fetchCourses = async () => {
  fetchingCourses.value = true;
  const fetchedCourses = await fetchStudentCourseBySession(
    studentId,
    session.value.semester,
    session.value.level,
  );
  if (fetchedCourses) {
    courses.value = fetchedCourses;
  }
  fetchingCourses.value = false;
};

const handleScoreChange = (row: any) => {
  row.grade = calculateGrade(row.score);
  row.point = calculatePoint(row.grade, row.unit);
};

const result = ref({});
const resultId = ref(null);
const resultFound = ref(false);
const resultFormatted = ref(false);
const resultSaved = ref(false);

const handleFormatCoursesAsResult = () => {
  formatCoursesAsResult();
  resultFormatted.value = true;
};

const formatCoursesAsResult = () => {
  const formattedCourses = courses.value.map((course: any) => {
    return {
      id: course.course.course_id,
      title: course.course.title,
      code: course.course.course_code,
      score: course.score,
      unit: course.unit,
      grade: course.grade,
      point: course.point,
      level: course.level,
      semester: course.semester,
    };
  });
  const totalUnit = formattedCourses.reduce(
    (total, course) => total + course.unit,
    0,
  );
  const totalPointScored = formattedCourses.reduce(
    (total, course) => total + course.point,
    0,
  );
  const totalPoint = formattedCourses.reduce(
    (total, course) => total + 5 * course.point,
    0,
  );
  const gpa = Number((totalPointScored / totalUnit).toFixed(2));
  const gpaClass = calculateClass(gpa);
  result.value = resultFound.value
    ? {
        courses: formattedCourses,
        level: Number(session.value.level),
        semester: session.value.semester,
        user_id: studentId,
        student: student.value,
        total_point: totalPoint,
        total_point_scored: totalPointScored,
        total_unit: totalUnit,
        gpa,
        approved: false,
        class: gpaClass,
        id: resultId.value,
      }
    : {
        courses: formattedCourses,
        level: Number(session.value.level),
        semester: session.value.semester,
        user_id: studentId,
        student: student.value,
        total_point: totalPoint,
        total_point_scored: totalPointScored,
        total_unit: totalUnit,
        gpa,
        approved: false,
        class: gpaClass,
      };
};

const savingResult = ref(false);
const handleSaving = async () => {
  savingResult.value = true;
  const saved = await saveStudentResult(result.value);
  savingResult.value = false;
  if (saved) {
    resultSaved.value = true;
  } else {
    resultSaved.value = false;
  }
};

const formatCoursesIfResult = (result: any) => {
  const fetchedCourses = result.courses;
  fetchedCourses.forEach((course: any) => {
    const newCourse: any = courses.value.find(
      (fetchedCourse: any) => fetchedCourse.course.course_id === course.id,
    );
    if (newCourse) {
      newCourse.point = course.point;
      newCourse.grade = course.grade;
      newCourse.score = course.score;
    }
  });
  formatCoursesAsResult();
};

watch(
  () => route,
  async () => {
    session.value.level = route.query.level as string;
    session.value.semester = route.query.semester as string;
    const result: any = await fetchStudentResult(
      studentId,
      session.value.semester,
      session.value.level,
    );
    await fetchCourses();
    if (result) {
      resultFound.value = true;
      resultId.value = result.id;
      formatCoursesIfResult(result);
    } else {
      resultFound.value = false;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.cover-bg {
  background-image: url("../../../assets/images/cover.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
