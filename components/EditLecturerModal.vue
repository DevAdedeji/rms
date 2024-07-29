<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Edit Lecturer</p>
      </template>
      <form class="flex flex-col gap-6" @submit.prevent="handleEditExamOfficer">
        <div class="grid grid-cols-2 gap-2">
          <UFormGroup label="First Name">
            <UInput
              v-model="form.first_name"
              placeholder="First Name"
              required
            />
          </UFormGroup>
          <UFormGroup label="Last Name">
            <UInput v-model="form.last_name" placeholder="Last Name" required />
          </UFormGroup>
        </div>
        <UFormGroup label="Select Faculty">
          <USelectMenu
            v-model="form.faculty"
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
        <UFormGroup label="Select department">
          <USelectMenu
            v-model="form.department"
            :options="departments"
            placeholder="Filter by department"
            option-attribute="name"
            :loading="searching"
            required
          >
            <template #option="{ option: dept }">
              <span class="truncate">{{ dept.name }}</span>
            </template>
            <template #empty>
              <p>Select faculty first</p>
            </template>
          </USelectMenu>
        </UFormGroup>
        <div class="flex justify-end">
          <UButton type="submit" class="px-6" :loading="updating">Save</UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { type facultyType } from "~/types/faculty";
import { type departmentType } from "~/types/department";
import { type User } from "~/types/auth/user";
const emits = defineEmits(["updated"]);
const model = defineModel({ type: Boolean, default: false });
const { updateLecturer, updated, updating } = useUpdateLecturer();
const { getUser } = useUser();

const props = defineProps<{
  lecturer: User | null;
}>();

const form = ref<any>({
  faculty: null,
  department: null,
  first_name: "",
  last_name: "",
  id: "",
});

const { fetchDepartmentsByFacultyId } = useDepartments();
const { fetchAllFaculties } = useFaculties();

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

watch(
  () => props.lecturer,
  () => {
    if (props.lecturer) {
      form.value.faculty = props.lecturer.faculty;
      form.value.first_name = props.lecturer.first_name;
      form.value.last_name = props.lecturer.last_name;
      form.value.department = props.lecturer.department;
      form.value.id = props.lecturer.id;
    }
  },
  { immediate: true },
);

const handleEditExamOfficer = async () => {
  await updateLecturer(form.value);
  model.value = false;
  form.value.faculty = null;
  form.value.department = null;
  form.value.first_name = "";
  form.value.last_name = "";
};

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

onMounted(async () => {
  await getFaculties();
  prefillFacultyData();
});
</script>
