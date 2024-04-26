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
          <NuxtLink class="flex items-center gap-4 py-1 px-2" :to="link.route">
            <UIcon :name="link.icon" />
            <p>{{ link.label }}</p>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute();
const links = ref([
  {
    label: "Dashboard",
    icon: "i-heroicons-home-solid",
    route: "/school/dashboard",
  },
  {
    label: "Exam Officers",
    icon: "i-heroicons-user-circle-solid",
    route: "/exam-officers",
  },
  {
    label: "Faculties",
    icon: "i-heroicons-building-library-solid",
    route: "/faculties",
  },
  {
    label: "Departments",
    icon: "i-heroicons-building-office-solid",
    route: "/departments",
  },
  {
    label: "Students",
    icon: "i-heroicons-user-group-solid",
    route: "/students",
  },
]);

const selectedRoute = useSelectedRoute();
watch(
  () => route.path,
  () => {
    const link = links.value.find((link) => link.route === route.path);
    if (link) {
      selectedRoute.value = link.label;
    }
  },
  { immediate: true },
);
</script>
