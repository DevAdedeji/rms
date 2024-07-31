<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Edit Course</p>
      </template>
      <form class="flex flex-col gap-4" @submit.prevent="handleEditCourse">
        <UFormGroup label="Course Title">
          <UInput
            v-model="form.title"
            placeholder="Enter title"
            type="text"
            required
          />
        </UFormGroup>
        <div class="grid grid-cols-2 gap-2">
          <UFormGroup label="Course Code">
            <UInput
              v-model="form.course_code"
              placeholder="Enter Code"
              required
            />
          </UFormGroup>
          <UFormGroup label="Unit">
            <UInput
              v-model="form.unit"
              type="number"
              placeholder="Enter unit"
              min="1"
              max="10"
              required
            />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <UFormGroup label="Level">
            <USelectMenu
              v-model="form.level"
              :options="levelOptions"
              required
            />
          </UFormGroup>
          <UFormGroup label="Semester">
            <USelectMenu
              v-model="form.semester"
              :options="semesterOptions"
              required
            />
          </UFormGroup>
        </div>
        <!-- <UFormGroup label="Select department">
          <USelectMenu
            v-model="form.department"
            :options="departments"
            placeholder="Select department"
            option-attribute="name"
            :loading="searching"
            required
            disabled
          >
            <template #option="{ option: dept }">
              <span class="truncate">{{ dept.name }}</span>
            </template>
            <template #empty>
              <p>Select faculty first</p>
            </template>
          </USelectMenu>
        </UFormGroup> -->
        <UFormGroup label="Select lecturer">
          <USelectMenu
            v-model="form.lecturer"
            :options="lecturers"
            placeholder="Select lecturer"
            option-attribute="first_name"
            :loading="gettingLecturers"
            required
          >
            <template #label>
              <span v-if="form.lecturer" class="truncate">{{
                form.lecturer.first_name + " " + form.lecturer.last_name
              }}</span>
              <span v-else>Select lecturer</span>
            </template>
            <template #option="{ option: lecturer }">
              <span class="truncate">{{
                lecturer.first_name + " " + lecturer.last_name
              }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <div class="flex justify-end">
          <UButton
            type="submit"
            :loading="updating"
            :disabled="updating"
            class="px-6"
            >Save</UButton
          >
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { type facultyType } from "~/types/faculty";
import { type departmentType } from "~/types/department";
import type { User } from "~/types/auth/user";

const { fetchDepartmentsByFacultyId } = useDepartments();
const { fetchAllFaculties } = useFaculties();
const { fetchLecturers } = useLecturers();
const { updating, updated, updateCourse } = useUpdateCourse();
const { getUser } = useUser();

const model = defineModel({ type: Boolean, default: false });
const emits = defineEmits(["updated"]);

const props = defineProps<{
  course: any | null;
}>();

const levelOptions = ref(["100", "200", "300", "400", "500"]);
const semesterOptions = ref(["harmattan", "rain"]);
const form = ref<any>({
  faculty: null,
  department: null,
  course_code: "",
  title: "",
  unit: null,
  level: null,
  semester: "",
  lecturer: null,
});

const handleEditCourse = async () => {
  form.value.level = Number(form.value.level);
  form.value.id = props.course.id;
  await updateCourse(form.value);
  model.value = false;
  form.value.faculty = null;
  form.value.department = null;
  form.value.course_code = "";
  form.value.title = "";
  form.value.unit = null;
  form.value.semester = "";
  form.value.level = null;
  form.value.lecturer = null;
};

const user = getUser();
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
const departments = ref<departmentType[]>([]);
const searching = ref(false);
const getDepartments = async (id: string) => {
  try {
    searching.value = true;
    const data = await fetchDepartmentsByFacultyId(id);
    departments.value = data;
  } catch (e) {
    // console.log(e);
  } finally {
    searching.value = false;
  }
};

const lecturers = ref<User[]>([]);
const gettingLecturers = ref(false);
const getLecturers = async () => {
  try {
    gettingLecturers.value = true;
    const data = await fetchLecturers();
    lecturers.value = data;
  } catch {
  } finally {
    gettingLecturers.value = false;
  }
};

watch(
  () => form.value.faculty,
  async () => {
    if (form.value.faculty && form.value.faculty.id) {
      const facultyId = form.value.faculty.id as string;
      await getDepartments(facultyId);
      prefillDepartmentData();
    }
  },
);

watch(updated, () => {
  emits("updated");
});

const prefillFacultyData = () => {
  const examOfficerFacId = user.faculty?.id;
  const faculty = faculties.value.find(
    (faculty) => faculty.id === examOfficerFacId,
  );
  if (faculty) {
    form.value.faculty = faculty;
  }
};

const prefillDepartmentData = () => {
  const examOfficerDeptId = user.department?.id;

  const department = departments.value.find(
    (dept) => dept.id === examOfficerDeptId,
  );
  if (department) {
    form.value.department = department;
  }
};

watch(
  () => props.course,
  () => {
    if (props.course) {
      form.value.faculty = props.course.faculty;
      form.value.department = props.course.department;
      form.value.course_code = props.course.course_code;
      form.value.title = props.course.title;
      form.value.unit = props.course.unit;
      form.value.semester = props.course.semester;
      form.value.level = props.course.level;
      form.value.lecturer = props.course.lecturer;
    }
  },
);

onMounted(async () => {
  await Promise.all([getFaculties(), getLecturers()]);
  prefillFacultyData();
});
</script>
