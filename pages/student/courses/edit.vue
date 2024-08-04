<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-10 py-10">
      <div
        class="flex flex-col items-center gap-3 text-center border border-gray-300 rounded-md p-4 cover-bg"
      >
        <UAvatar :alt="name" size="3xl" class="!border !border-gray-300" />
        <div class="flex flex-col gap-2">
          <p class="text-2xl">{{ name }}</p>
          <p>Matric Number: {{ student.matric_no }}</p>
        </div>
      </div>
      <div class="flex items-center gap-10">
        <div class="flex flex-col gap-1">
          <p class="text-xl font-medium">Level:</p>
          <p class="font-semibold text-lg text-blue-500">{{ session.level }}</p>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-xl font-medium">Semester:</p>
          <p class="capitalize font-semibold text-lg text-blue-500">
            {{ session.semester }}
          </p>
        </div>
      </div>
      <div v-if="!edit" class="w-full flex flex-col gap-3">
        <div class="flex items-center justify-end">
          <UButton v-if="registeredCourses.length" @click="edit = true">
            Edit Courses
          </UButton>
          <UButton
            v-else
            :to="`/student/courses/register?type=old&level=${session.level}&semester=${session.semester}`"
          >
            Register Courses
          </UButton>
        </div>
        <UTable
          :rows="registeredCourses"
          :columns="columns"
          :empty-state="{
            icon: 'i-heroicons-circle-stack-20-solid',
            label: 'No courses registered!.',
          }"
          :loading="fetchingCourses"
        >
          <template #course_code-data="{ row }">
            <p>{{ row.course.course_code }}</p>
          </template>
          <template #title-data="{ row }">
            <p>{{ row.course.title }}</p>
          </template>
        </UTable>
      </div>
      <div v-else class="flex flex-col gap-3">
        <div class="flex items-center justify-end">
          <UButton v-if="selectedCourses.length" @click="handlePreviewCourses"
            >Preview Courses</UButton
          >
        </div>
        <UTabs :items="items" class="w-full">
          <template #item="{ item }">
            <UCard>
              <div v-if="item.key === 'registered_courses'" class="space-y-3">
                <UTable
                  v-model="selectedCourses"
                  :rows="courses"
                  :columns="columns"
                  :loading="fetchingCourses"
                  :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No Registered Courses found!.',
                  }"
                >
                  <template #course_code-data="{ row }">
                    <p>{{ row.course.course_code }}</p>
                  </template>
                  <template #title-data="{ row }">
                    <p>{{ row.course.title }}</p>
                  </template>
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
                  :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No Courses found!.',
                  }"
                  :loading="fetchingAdditionalCourses"
                >
                </UTable>
              </div>
            </UCard>
          </template>
        </UTabs>
      </div>
    </div>
    <LazyPreviewEditCoursesModal
      v-model="showPreviewCoursesModal"
      :courses="updatedCourses"
      :saving="saving"
      @checked="saveUpdatedCourses"
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
  fetchRegisteredCourses,
  fetchCoursesByFacultyAndSemester,
  registerUpdatedCourses,
} = useStudentCourses();
const { fetchAllFaculties } = useFaculties();

const user = getUser();
const toast = useToast();
const route = useRoute();

const studentId = user.id;
const showPreviewCoursesModal = ref(false);
const edit = ref(false);

const { data, error, refresh } = await useAsyncData(
  "a student edit registered course page",
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
const session = ref({
  level: "",
  semester: "",
});

const items = [
  {
    key: "registered_courses",
    label: "Registered Courses",
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

const courses = ref([]);
const selectedCourses = ref<any[]>([]);
const registeredCourses = ref<any[]>([]);
const updatedCourses = ref<any[]>([]);
const fetchingCourses = ref(false);
const fetchingAdditionalCourses = ref(false);
const additionalCourses = ref([]);
const filteredAdditionalCourses = ref([]);

const getRegisteredCourses = async () => {
  if (student.value?.id || user.id) {
    fetchingCourses.value = true;
    session.value.level = route.query.level as string;
    session.value.semester = route.query.semester as string;
    const level = Number(session.value.level);
    const fetchedCourses = await fetchRegisteredCourses(
      level,
      session.value.semester,
      student.value?.id || user.id,
    );
    if (fetchedCourses && fetchedCourses.length) {
      courses.value = fetchedCourses;
      selectedCourses.value = fetchedCourses;
      registeredCourses.value = fetchedCourses;
    }
    fetchingCourses.value = false;
  }
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
  if (facultySelected.value) {
    fetchingAdditionalCourses.value = true;
    const fetchedCourses = await fetchCoursesByFacultyAndSemester(
      facultySelected.value.id as string,
      session.value.semester,
    );
    if (fetchedCourses && fetchedCourses.length) {
      additionalCourses.value = fetchedCourses;
      filteredAdditionalCourses.value = fetchedCourses;
    }
    fetchingAdditionalCourses.value = false;
  }
};

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

const nonSelectedCourses = computed(() => {
  const selectedIds = new Set(
    selectedCourses.value.map((course: any) => course.id),
  );
  return courses.value.filter((course: any) => !selectedIds.has(course.id));
});

const handlePreviewCourses = () => {
  let redatedCourses: any = [];
  if (nonSelectedCourses.value.length) {
    redatedCourses = nonSelectedCourses.value;
    redatedCourses.forEach((course: any) => (course.registered = false));
  }
  const courses = [...redatedCourses, ...selectedCourses.value];
  try {
    const refactoredCourses = courses.map((course: any) => {
      const conditionalProperties = course.course?.id ? { id: course.id } : {};
      return {
        ...conditionalProperties,
        course: course.course || course,
        unit: course.course?.unit || course.unit,
        course_id: course.course?.id || course.id,
        student_id: student.value?.id,
        student: student.value,
        grade: null,
        point: 0,
        score: 0,
        semester: session.value.semester,
        level: session.value.level,
        registered: course.registered === false ? course.registered : true,
      };
    });
    updatedCourses.value = refactoredCourses;
    showPreviewCoursesModal.value = true;
  } catch (e) {
    // throw new Error(e);
  }
};

const saving = ref(false);
const saveUpdatedCourses = async () => {
  saving.value = true;
  const saved = await registerUpdatedCourses(updatedCourses.value);
  if (saved) {
    showPreviewCoursesModal.value = false;
    refresh();
    edit.value = false;
    await getRegisteredCourses();
  }
  saving.value = false;
};

watch(
  () => route,
  async () => {
    await getRegisteredCourses();
  },
  { immediate: true },
);

onMounted(() => {
  getFaculties();
});
</script>

<style scoped>
.cover-bg {
  background-image: url("../../../assets/images/cover.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
