<template>
  <USlideover
    v-model="openMobileNav"
    side="left"
    class="!w-[300px]"
    :ui="{
      width: 'w-[300px]',
    }"
  >
    <aside
      class="bg-gray-100 h-screen flex flex-col border border-gray-200 px-6"
    >
      <img
        src="../assets/images/logo.png"
        class="w-[200px] object-contain py-3"
      />
      <nav class="py-3">
        <ul class="flex flex-col gap-4 text-md w-full">
          <li
            v-for="link in links"
            :key="link.route"
            class="hover:bg-gray-200 rounded-md w-full flex items-center py-2"
            :class="route.path === link.route ? 'bg-gray-200' : ''"
          >
            <NuxtLink
              class="w-full flex items-center text-sm gap-4 py-1 px-2"
              :to="link.route"
            >
              <UIcon :name="link.icon" />
              <p>{{ link.label }}</p>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>
  </USlideover>
</template>

<script setup>
import { UserTypes } from "~/types/auth/user";
const route = useRoute();
const { getUser } = useUser();
const { openMobileNav } = useMobileNav();

const userProfile = ref(null);
const links = computed(() => {
  if (userProfile.value && userProfile.value.role) {
    if (userProfile.value.role === UserTypes.school) {
      return [
        {
          label: "Faculties",
          icon: "i-heroicons-building-library-solid",
          route: "/admin/faculties",
        },
        {
          label: "Departments",
          icon: "i-heroicons-building-office-solid",
          route: "/admin/departments",
        },
        {
          label: "H.O.D(s)",
          icon: "i-heroicons-user-circle-solid",
          route: "/admin/head-of-departments",
        },
        {
          label: "Exam Officers",
          icon: "i-heroicons-user-solid",
          route: "/admin/exam-officers",
        },
        {
          label: "Sessions & Semesters",
          icon: "i-heroicons-square-3-stack-3d-solid",
          route: "/admin/sessions",
        },
      ];
    }
    if (userProfile.value.role === UserTypes.student) {
      return [
        {
          label: "Results",
          icon: "i-heroicons-calendar-days-solid",
          route: "/student/results",
        },
        {
          label: "Registered Courses",
          icon: "i-heroicons-bookmark-square-solid",
          route: "/student/courses/history",
        },
        {
          label: "Register Courses",
          icon: "i-heroicons-book-open-solid",
          route: "/student/courses/register",
        },
      ];
    }
    if (userProfile.value.role === UserTypes.lecturer) {
      return [
        {
          label: "Courses",
          icon: "i-heroicons-book-open-solid",
          route: "/lecturer/courses",
        },
      ];
    }
    if (userProfile.value.role === UserTypes.hod) {
      return [
        {
          label: "Students",
          icon: "i-heroicons-user-circle-solid",
          route: "/hod/students",
        },
      ];
    }
    if (userProfile.value.role === UserTypes.faculty) {
      return [
        {
          label: "Lecturers",
          icon: "i-heroicons-user-solid",
          route: "/exam-officer/lecturers",
        },
        {
          label: "Students",
          icon: "i-heroicons-user-circle-solid",
          route: "/exam-officer/students",
        },
        {
          label: "Courses",
          icon: "i-heroicons-book-open-solid",
          route: "/exam-officer/courses",
        },
      ];
    }
  }
});

const selectedRoute = useSelectedRoute();
watch(
  () => route.path,
  () => {
    if (links.value) {
      const link = links.value.find((link) => link.route === route.path);
      if (link) {
        selectedRoute.value = link.label;
      }
    }
  },
  { immediate: true },
);

onBeforeMount(() => {
  const userDetails = getUser();
  userProfile.value = userDetails;
});

onMounted(() => {
  if (links.value) {
    const link = links.value.find((link) => link.route === route.path);
    if (link) {
      selectedRoute.value = link.label;
    }
  }
});
</script>
