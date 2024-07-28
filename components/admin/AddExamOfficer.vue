<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Add Exam Officer</p>
      </template>
      <form class="flex flex-col gap-6" @submit.prevent="handleAddExamOfficer">
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
        <UFormGroup label="Email Address">
          <UInput
            v-model="form.email"
            placeholder="johndoe@gmail.com"
            type="email"
            required
          />
        </UFormGroup>
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
        <UFormGroup label="Password">
          <UInput
            v-model="form.password"
            placeholder="********"
            type="password"
            required
          />
        </UFormGroup>
        <div class="flex justify-end">
          <UButton type="submit" class="px-6" :loading="adding">Save</UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { type facultyType } from "~/types/faculty";
import { type departmentType } from "~/types/department";
import { type OfficersFormType } from "~/types/admin";
const emits = defineEmits(["added"]);
const model = defineModel({ type: Boolean, default: false });
const { addExamOfficer, adding, added } = useAddExamOfficer();

const form = ref<OfficersFormType>({
  faculty: null,
  department: null,
  first_name: "",
  last_name: "",
  email: "",
  password: "",
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

watch(added, () => {
  emits("added");
});

const handleAddExamOfficer = async () => {
  await addExamOfficer(form.value);
  model.value = false;
  form.value.faculty = null;
  form.value.department = null;
  form.value.first_name = "";
  form.value.last_name = "";
  form.value.email = "";
  form.value.password = "";
};

onMounted(() => {
  getFaculties();
});
</script>
