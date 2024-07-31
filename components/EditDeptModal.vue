<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Edit Department</p>
      </template>
      <form class="flex flex-col gap-6" @submit.prevent="updateDept">
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
        <UFormGroup label="Department Name">
          <UInput v-model="form.name" placeholder="Enter department name" />
        </UFormGroup>
        <div class="flex justify-end">
          <UButton
            type="submit"
            class="px-6"
            :loading="updating"
            :disabled="updating"
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
const emits = defineEmits(["updated"]);
const model = defineModel({ type: Boolean, default: false });
const props = defineProps<{
  department: departmentType | null;
}>();

const form = ref<departmentType>({
  faculty: null,
  name: "",
  id: "",
});
const { updating, updated, updateDepartment } = useUpdateDepartment();
const updateDept = async () => {
  await updateDepartment(form.value);
  model.value = false;
  form.value.faculty = null;
  form.value.name = "";
  form.value.id = "";
};

watch(updated, () => {
  emits("updated");
});

watch(
  () => props.department,
  () => {
    if (props.department) {
      form.value.faculty = props.department.faculty;
      form.value.name = props.department.name;
      form.value.id = props.department.id;
    }
  },
  { immediate: true },
);

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
onMounted(() => {
  getFaculties();
});
</script>
