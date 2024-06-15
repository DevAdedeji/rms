<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Edit Exam Officer</p>
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
const emits = defineEmits(["updated"]);
const model = defineModel({ type: Boolean, default: false });
const { updateExamOfficer, updated, updating } = useExamOfficers();

const props = defineProps<{
  exam_officer: any | null;
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
    }
  },
);

watch(updated, () => {
  emits("updated");
});

watch(
  () => props.exam_officer,
  () => {
    if (props.exam_officer) {
      form.value.faculty = props.exam_officer.faculty;
      form.value.first_name = props.exam_officer.first_name;
      form.value.last_name = props.exam_officer.last_name;
      form.value.department = props.exam_officer.department;
      form.value.id = props.exam_officer.id;
    }
  },
  { immediate: true },
);

const handleEditExamOfficer = async () => {
  await updateExamOfficer(form.value);
  model.value = false;
  form.value.faculty = null;
  form.value.department = null;
  form.value.first_name = "";
  form.value.last_name = "";
};

onMounted(() => {
  getFaculties();
});
</script>
