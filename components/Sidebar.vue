<template>
  <aside
    class="bg-gray-100 h-screen fixed left-0 w-[250px] flex flex-col items-center border border-gray-200"
  >
    <img
      src="../assets/images/logo.png"
      class="w-[200px] object-contain py-3"
    />
    <nav class="py-3 w-[80%] mx-auto">
      <ul class="flex flex-col gap-4 text-md w-full">
        <li
          v-for="link in links"
          :key="link.route"
          class="hover:bg-gray-200 rounded-md w-full flex items-center"
          :class="route.path === link.route ? 'bg-gray-200' : ''"
        >
          <NuxtLink
            class="w-full flex items-center gap-4 py-1 px-2"
            :to="link.route"
          >
            <UIcon :name="link.icon" />
            <p>{{ link.label }}</p>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { UserTypes } from "~/types/auth/user";
const route = useRoute();
const { getUser } = useUser();

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
      ];
    }
    if (userProfile.value.role === UserTypes.student) {
      return [
        {
          label: "Dashboard",
          icon: "i-heroicons-home-solid",
          route: "/student/dashboard",
        },
        {
          label: "Results",
          icon: "i-heroicons-calendar-days-solid",
          route: "/student/results",
        },
      ];
    }
    if (userProfile.value.role === UserTypes.faculty) {
      return [
        {
          label: "Dashboard",
          icon: "i-heroicons-home-solid",
          route: "/exam-officer/dashboard",
        },
        {
          label: "Students",
          icon: "i-heroicons-calendar-days-solid",
          route: "/exam-officer/students",
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
</script>
