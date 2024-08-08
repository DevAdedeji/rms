<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-10 py-10">
      <div class="w-full">
        <form
          class="w-[300px] flex flex-col gap-3"
          @submit.prevent="handleSemesterSelected"
        >
          <UFormGroup label="Your Level">
            <USelectMenu
              v-model="form.level"
              :options="levelOptions"
              placeholder="Select Level"
              :disabled="disableLevelOption"
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
              :disabled="disableSemesterOption"
            />
          </UFormGroup>
          <UButton
            class="px-6 self-end"
            size="xl"
            :loading="fetchingCourses"
            :disabled="fetchingCourses"
            type="submit"
          >
            Proceed
          </UButton>
        </form>
      </div>
      <div class="w-full flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <p>
            Total Units:
            <span class="text-blue-500 font-semibold">{{ totalUnits }}</span>
          </p>
          <UButton
            v-if="selectedCourses.length"
            @click="showPreviewCoursesModal = true"
            >Preview Courses</UButton
          >
        </div>
        <UTabs :items="items" class="w-full">
          <template #item="{ item }">
            <UCard>
              <div v-if="item.key === 'compulsory_courses'" class="space-y-3">
                <UTable
                  v-model="selectedCourses"
                  :rows="courses"
                  :columns="columns"
                  :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No Departmental Courses found!.',
                  }"
                  :loading="fetchingCourses"
                >
                </UTable>
              </div>
              <div
                v-else-if="item.key === 'additional_courses'"
                class="space-y-3 flex flex-col gap-5"
              >
                <div class="flex items-center justify-between">
                  <form @submit.prevent="handleFacultySelected">
                    <div class="flex items-end gap-2">
                      <UFormGroup label="Select Faculty" class="!w-[300px]">
                        <USelectMenu
                          v-model="facultySelected"
                          :loading="fetchingFaculties"
                          :options="faculties"
                          option-attribute="name"
                          placeholder="Select faculty"
                          required
                        >
                          <template #option="{ option: faculty }">
                            <span class="truncate">{{ faculty.name }}</span>
                          </template>
                        </USelectMenu>
                      </UFormGroup>
                      <UButton
                        icon="i-heroicons-arrow-right"
                        size="md"
                        color="primary"
                        square
                        :loading="fetchingAdditionalCourses"
                        variant="solid"
                        type="submit"
                      />
                    </div>
                  </form>
                  <USelectMenu
                    v-model="levelSelected"
                    :options="levelOptions"
                    placeholder="Filter by Level"
                  />
                </div>
                <UTable
                  v-model="selectedCourses"
                  :rows="filteredAdditionalCourses"
                  :columns="columns"
                  :loading="fetchingAdditionalCourses"
                  :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No Courses found!.',
                  }"
                >
                </UTable>
              </div>
            </UCard>
          </template>
        </UTabs>
      </div>
    </div>
    <LazyPreviewCoursesModal
      v-model="showPreviewCoursesModal"
      :courses="selectedCourses"
      :saving="saving"
      @checked="saveSelectedCourses"
    />
  </main>
</template>

<script setup lang="ts">
import { type facultyType } from "~/types/faculty";
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const { fetchStudentById } = useStudent();
const { getUser } = useUser();
const {
  fetchCoursesByLevelAndSemester,
  fetchCoursesByFacultyAndSemester,
  registerCourses,
} = useStudentCourses();
const { fetchAllFaculties } = useFaculties();
const { fetchActiveSession } = useSessions();
const { fetchActiveSemester } = useSemesters();
const user = getUser();
const toast = useToast();
const route = useRoute();

const showPreviewCoursesModal = ref(false);

const studentId = user.id;

const { data, error } = await useAsyncData(
  "a student register course page",
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

const form = ref({
  semester: "",
  level: "",
});

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
  if (student.value && student.value.cert && student.value.level) {
    let levels = student.value.cert.id === 1 ? extendedLevels : baseLevels;

    const studentLevel =
      typeof student.value.level === "number"
        ? student.value.level
        : Number(student.value.level);

    levels = levels.filter((level) => Number(level) <= studentLevel);
    return levels;
  } else {
    return extendedLevels;
  }
});

const items = [
  {
    key: "compulsory_courses",
    label: "Departmental Courses",
  },
  {
    key: "additional_courses",
    label: "Additional Courses",
  },
];

const columns = [
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
];

const totalUnits = computed(() =>
  selectedCourses.value.reduce((total, course: any) => total + course.unit, 0),
);

const courses = ref([]);
const additionalCourses = ref([]);
const filteredAdditionalCourses = ref([]);
const selectedCourses = ref<any[]>([]);
const fetchingCourses = ref(false);
const fetchingAdditionalCourses = ref(false);
const handleSemesterSelected = async () => {
  fetchingCourses.value = true;
  const fetchedCourses = await fetchCoursesByLevelAndSemester(
    Number(form.value.level),
    form.value.semester,
  );
  if (fetchedCourses && fetchedCourses.length) {
    courses.value = fetchedCourses;
  }
  fetchingCourses.value = false;
};

const facultySelected = ref<facultyType | null>(null);
const faculties = ref<facultyType[]>([]);
const fetchingFaculties = ref(false);
const getFaculties = async () => {
  try {
    fetchingFaculties.value = true;
    const data = await fetchAllFaculties();
    faculties.value = data;
  } finally {
    fetchingFaculties.value = false;
  }
};

const handleFacultySelected = async () => {
  if (!form.value.semester) {
    toast.add({
      title: "Error",
      description: "Pls select semester above!",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
    return;
  }
  if (facultySelected.value) {
    fetchingAdditionalCourses.value = true;
    const fetchedCourses = await fetchCoursesByFacultyAndSemester(
      facultySelected.value.id as string,
      form.value.semester,
    );
    if (fetchedCourses && fetchedCourses.length) {
      additionalCourses.value = fetchedCourses;
      filteredAdditionalCourses.value = fetchedCourses;
    }
    fetchingAdditionalCourses.value = false;
  }
};

const levelSelected = ref(null);

watch(levelSelected, () => {
  if (additionalCourses.value && levelSelected.value) {
    if (levelSelected.value === "All") {
      filteredAdditionalCourses.value = additionalCourses.value;
    } else {
      filteredAdditionalCourses.value = additionalCourses.value.filter(
        (course: any) => course.level === levelSelected.value,
      );
    }
  }
});

const activeSession = ref<any>({});
const activeSemester = ref<any>({});

const saving = ref(false);
const saveSelectedCourses = async () => {
  saving.value = true;
  const courses = selectedCourses.value.map((course) => ({
    course,
    unit: course.unit,
    course_id: course.id,
    student_id: student.value?.id,
    student: student.value,
    grade: null,
    point: 0,
    score: 0,
    semester: form.value.semester,
    level: form.value?.level,
    registered: true,
    session: activeSession.value,
  }));
  const saved = await registerCourses(courses);
  if (saved) {
    return navigateTo(
      `/student/courses/edit?level=${form.value.level}&semester=${form.value.semester}`,
    );
  }
  saving.value = false;
};

const disableSemesterOption = ref(false);
const disableLevelOption = ref(false);
watch(
  [student, () => route, activeSemester],
  () => {
    if (route.query.type === "old") {
      form.value.semester = route.query.semester as string;
      form.value.level = route.query.level as string;
      disableSemesterOption.value = true;
      disableLevelOption.value = true;
      return;
    }
    if (route.query.type === "new") {
      form.value.semester = route.query.semester as string;
      form.value.level = route.query.level as string;
      disableSemesterOption.value = true;
      disableLevelOption.value = true;
      return;
    }
    if (student.value && student.value.level) {
      form.value.level = student.value.level as string;
      disableLevelOption.value = true;
      if (activeSemester.value) {
        const semester: any = semesterOptions.value.find(
          (semester: any) => semester.value === activeSemester.value.name,
        );
        if (semester) {
          form.value.semester = semester.value;
          disableSemesterOption.value = true;
        }
      }
    }
  },
  { immediate: true },
);

const handleFetchActiveSession = async () => {
  const session = await fetchActiveSession();
  if (session) {
    activeSession.value = session;
  }
};

const handleFetchActiveSemester = async () => {
  const semester = await fetchActiveSemester();
  if (semester) {
    activeSemester.value = semester;
  }
};

onMounted(async () => {
  await Promise.all([handleFetchActiveSession(), getFaculties()]);
});
onBeforeMount(async () => {
  await handleFetchActiveSemester();
});
</script>
