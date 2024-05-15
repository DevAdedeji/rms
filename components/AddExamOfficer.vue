<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Add New Department</p>
      </template>
      <form class="flex flex-col gap-6" @submit.prevent>
        <UFormGroup label="Select Faculty">
          <USelectMenu
            v-model="form.faculty"
            :loading="fetchingFaculties"
            :options="faculties"
            option-attribute="name"
            placeholder="Select faculty"
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
          <UButton type="submit" class="px-6">Save</UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { type facultyType } from "~/types/faculty";
import { type departmentType } from "~/types/department";
// const emits = defineEmits(["added"]);
const model = defineModel({ type: Boolean, default: false });

interface formType {
  faculty: facultyType | null;
  department: departmentType | null;
  name: string;
}

const form = ref<formType>({
  faculty: null,
  department: null,
  name: "",
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
onMounted(() => {
  getFaculties();
});
</script>
