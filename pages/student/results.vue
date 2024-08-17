<template>
  <main class="bg-white min-h-screen w-full lg:pr-5">
    <div class="flex flex-col h-full items-center justify-center py-10 gap-10">
      <div
        v-if="!resultFound"
        class="w-full min-h-[70vh] flex items-center justify-center"
      >
        <form
          class="flex flex-col gap-6 w-[90%] sm:w-2/3 md:w-[50%] px-10 pt-10 pb-20 rounded-md shadow-xl"
          @submit.prevent="searchForResult"
        >
          <h2 class="text-center text-xl sm:text-2xl py-6">
            Select Academic Session
          </h2>
          <UFormGroup label="Your Level">
            <USelectMenu
              v-model="form.level"
              :options="levelOptions"
              placeholder="Select Level"
              required
            />
          </UFormGroup>
          <UFormGroup label="Semester">
            <USelectMenu
              v-model="form.semester"
              :options="semesterOptions"
              placeholder="Select Semester"
              value-attribute="value"
              required
            />
          </UFormGroup>
          <div class="flex items-center justify-center">
            <UButton class="px-10" size="xl" type="submit" :loading="searching">
              Search
            </UButton>
          </div>
        </form>
      </div>
      <div v-else class="w-[90%] mx-auto lg:w-full flex flex-col gap-10">
        <div
          class="w-full flex flex-col gap-3 bg-[#DDF9FD] p-4 md:w-1/3 font-bold"
        >
          <p class="text-[#09A5BE]">
            <span class="text-[#000000]">Level:</span> {{ form.level }}L
          </p>
          <p class="capitalize text-[#09A5BE]">
            <span class="text-[#000000]">Semester:</span>
            {{ form.semester }} semester
          </p>
        </div>
        <UTable :rows="courses" :columns="columns">
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
            <p>{{ row.score }}</p>
          </template>
          <template #grade-data="{ row }">
            <UInput v-model="row.grade" disabled class="w-[50px]" />
          </template>
          <template #point-data="{ row }">
            <UInput v-model="row.point" disabled class="w-[50px]" />
          </template>
        </UTable>
        <div>
          <p class="text-2xl font-semibold text-gray-600 capitalize pb-2">
            {{ form.semester }} Semester Result GPA
          </p>
          <div class="w-full md:w-1/2">
            <UTable :rows="[result]" :columns="semesterResultColumn" />
          </div>
        </div>
      </div>
    </div>
    <LazyResultNotFoundModal v-model="showResultNotFoundModal" />
    <LazyResultNotApprovedModal v-model="showResultNotYetApprovedModal" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { getUser } = useUser();
// const toast = useToast();
const { fetchStudentSemesterResult } = useStudentResult();
const { calculateClass } = useCalculator();

const student = getUser();

const studentId = student.id;

const semesterOptions = ref([
  {
    value: "harmattan",
    label: "Harmattan Semester",
  },
  {
    value: "rain",
    label: "Rain Semester",
  },
]);

const levelOptions = computed(() => {
  const baseLevels = ["100", "200", "300", "400"];
  const extendedLevels = [...baseLevels, "500"];
  if (student && student.cert && student.level) {
    let levels = student.cert.id === 1 ? extendedLevels : baseLevels;

    const studentLevel =
      typeof student.level === "number" ? student.level : Number(student.level);

    levels = levels.filter((level) => level <= studentLevel);
    return levels;
  } else {
    return extendedLevels;
  }
});

const form = ref({
  level: "",
  semester: "",
});

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

const searching = ref(false);
const courses = ref([]);
const resultFound = ref(false);
const result = ref<any>({});
const showResultNotFoundModal = ref(false);
const showResultNotYetApprovedModal = ref(false);

const calculateGPA = () => {
  const totalUnit = courses.value.reduce(
    (total, course: any) => total + course.unit,
    0,
  );
  const totalPointScored = courses.value.reduce(
    (total, course: any) => total + course.point,
    0,
  );
  const gpa = Number((totalPointScored / totalUnit).toFixed(2));
  const gpaClass = calculateClass(gpa);
  result.value = {
    total_point_scored: totalPointScored,
    total_unit: totalUnit,
    gpa,
    class: gpaClass,
  };
};

const searchForResult = async () => {
  searching.value = true;
  const fetchedCourses = await fetchStudentSemesterResult(
    studentId,
    form.value.level,
    form.value.semester,
  );
  if (fetchedCourses && fetchedCourses.length) {
    const resultApproved = fetchedCourses.every(
      (course: any) => course.approved,
    );
    if (!resultApproved) {
      showResultNotYetApprovedModal.value = true;
      searching.value = false;
    } else {
      courses.value = fetchedCourses;
      calculateGPA();
      resultFound.value = true;
    }
  } else {
    showResultNotFoundModal.value = true;
    searching.value = false;
  }
};
</script>
