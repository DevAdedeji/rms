<template>
  <main class="bg-primary min-h-screen w-full flex items-center justify-center">
    <div class="w-full h-full flex items-center justify-center">
      <UCard v-if="!showLoginForm">
        <div class="flex flex-col gap-6 items-center justify-center p-6">
          <img
            src="../../assets/images/logo.png"
            class="w-[200px] object-contain"
          />
          <h1 class="text-lg text-black text-center">
            Please select user type
          </h1>
          <div class="flex items-center gap-16">
            <button
              v-for="user in userTypes"
              :key="user.id"
              class="flex flex-col gap-3 items-center justify-center border rounded-lg border-gray-300 py-4 px-8"
              @click="selected = user.id"
            >
              <button
                v-if="selected !== user.id"
                class="border border-gray-300 rounded-full w-[20px] h-[20px]"
              ></button>
              <UIcon
                v-else
                name="i-heroicons-check-circle-solid"
                class="text-[20px] text-primary"
              />
              <img :src="user.image" class="w-[100px] object-contain" />
              <p>{{ user.name }}</p>
            </button>
          </div>
          <UButton class="py-2 px-4" @click="continueToLogin">
            Continue
          </UButton>
        </div>
      </UCard>
      <UCard v-else class="!w-[35%]">
        <UButton @click="showLoginForm = false">
          <UIcon name="i-heroicons-arrow-left-solid" class="text-2xl" />
        </UButton>
        <div class="w-full flex flex-col gap-6 items-center justify-center p-6">
          <img
            src="../../assets/images/logo.png"
            class="w-[200px] object-contain"
          />
          <AuthStudentLogin v-if="selected === UserTypes.student" />
          <AuthAdminLogin v-else />
        </div>
      </UCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { UserTypes } from "../../types/auth/user";
import StudentImage from "../../assets/images/student_icon.jpeg";
import FacultyAdminImage from "../../assets/images/faculty_admin_icon.jpg";
import SchoolAdminImage from "../../assets/images/school_admin_icon.png";

definePageMeta({
  middleware: ["auth"],
});

const toast = useToast();

const userTypes = ref([
  {
    id: UserTypes.student,
    name: "Student",
    image: StudentImage,
  },
  {
    id: UserTypes.faculty,
    name: "Exam Officer",
    image: FacultyAdminImage,
  },
  {
    id: UserTypes.school,
    name: "School Admin",
    image: SchoolAdminImage,
  },
]);

const selected = ref<UserTypes | null>(null);
const showLoginForm = ref(false);

const continueToLogin = () => {
  if (selected.value) {
    showLoginForm.value = true;
  } else {
    toast.add({
      id: "user-type-selected-error",
      title: "Error",
      description: "Please select user type",
      color: "primary",
    });
  }
};
</script>
