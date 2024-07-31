<template>
  <div class="w-full">
    <form class="flex flex-col gap-6" @submit.prevent="submitForm">
      <div class="grid grid-cols-2 gap-3">
        <UFormGroup
          label="First Name"
          :error="$v.first_name.$error && 'You must enter your first name'"
        >
          <UInput
            v-model="form.first_name"
            placeholder="Enter first name"
            :trailing-icon="
              $v.last_name.$error
                ? 'i-heroicons-exclamation-triangle-20-solid'
                : undefined
            "
          />
        </UFormGroup>
        <UFormGroup
          label="Last Name"
          :error="$v.last_name.$error && 'You must enter your last name'"
        >
          <UInput
            v-model="form.last_name"
            placeholder="Enter last name"
            :trailing-icon="
              $v.last_name.$error
                ? 'i-heroicons-exclamation-triangle-20-solid'
                : undefined
            "
          />
        </UFormGroup>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <UFormGroup
          label="Select Faculty"
          :error="$v.faculty.$error && 'You must select faculty'"
        >
          <USelectMenu
            v-model="form.faculty"
            :loading="fetchingFaculties"
            :options="faculties"
            option-attribute="name"
            placeholder="Select faculty"
            required
            :trailing-icon="
              $v.faculty.$error
                ? 'i-heroicons-exclamation-triangle-20-solid'
                : undefined
            "
          >
            <template #option="{ option: faculty }">
              <span class="truncate">{{ faculty.name }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup
          label="Select department"
          :error="$v.department.$error && 'You must select department'"
        >
          <USelectMenu
            v-model="form.department"
            :options="departments"
            placeholder="Select department"
            option-attribute="name"
            :loading="searching"
            required
            :trailing-icon="
              $v.department.$error
                ? 'i-heroicons-exclamation-triangle-20-solid'
                : undefined
            "
          >
            <template #option="{ option: dept }">
              <span class="truncate">{{ dept.name }}</span>
            </template>
            <template #empty>
              <p>Select faculty first</p>
            </template>
          </USelectMenu>
        </UFormGroup>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <UFormGroup
          label="Email Address"
          :error="$v.email.$error && 'You must enter email address'"
        >
          <UInput
            v-model="form.email"
            placeholder="adedejitewogbade2@gmail.com"
            :trailing-icon="
              $v.email.$error
                ? 'i-heroicons-exclamation-triangle-20-solid'
                : undefined
            "
          />
        </UFormGroup>
        <UFormGroup
          label="Password"
          :error="$v.password.$error && 'You must enter a password'"
        >
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Enter password"
            icon="i-heroicons-key"
            :trailing-icon="
              $v.password.$error
                ? 'i-heroicons-exclamation-triangle-20-solid'
                : undefined
            "
          />
        </UFormGroup>
      </div>
      <UButton
        type="submit"
        :loading="signing_up"
        class="flex items-center justify-center"
        >Sign Up</UButton
      >
    </form>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { type facultyType } from "~/types/faculty";
import { type departmentType } from "~/types/department";

// const toast = useToast();
// eslint-disable-next-line camelcase
const { signUpLecturer, signed_up, signing_up } = useSignUpLecturer();
const form = ref<any>({
  email: "",
  first_name: "",
  last_name: "",
  faculty: null,
  department: null,
  password: "",
});

const rules = computed(() => {
  return {
    email: { required },
    first_name: { required },
    last_name: { required },

    faculty: { required },
    department: { required },
    password: { required },
  };
});

const $v = useVuelidate(rules, form);

const submitForm = async () => {
  const isFormCorrect = await $v.value.$validate();
  if (isFormCorrect) {
    await signUpLecturer(form.value);
  }
};

watch(signed_up, () => {
  // eslint-disable-next-line camelcase
  if (signed_up.value) {
    return navigateTo("/auth/login");
  }
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

onMounted(async () => {
  await getFaculties();
});
</script>
