<template>
  <header
    class="bg-gray-100 fixed top-0 left-[250px] right-0 h-[60px] border border-gray-200 flex items-center justify-between px-4 !z-50"
  >
    <div class="flex items-center gap-4">
      <UIcon
        name="i-heroicons-arrow-left"
        class="text-2xl cursor-pointer"
        @click="router.go(-1)"
      />
      <h1 class="text-xl">{{ title }}</h1>
    </div>
    <UPopover>
      <UAvatar
        :alt="name"
        size="lg"
        chip-color="green"
        chip-position="bottom-right"
        class="!border !border-gray-300"
      />
      <template #panel>
        <div class="p-4 flex flex-col gap-5">
          <button
            v-for="link in links"
            :key="link.icon"
            class="flex items-center gap-2"
            @click="link.action"
          >
            <UIcon :name="link.icon" />
            <p>{{ link.label }}</p>
          </button>
        </div>
      </template>
    </UPopover>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
});

const { logOut } = useAuth();
const { getUser } = useUser();
const router = useRouter();

const userProfile = ref(null);

const name = computed(() =>
  userProfile.value
    ? userProfile.value.first_name + " " + userProfile.value.last_name
    : "Jane Doe",
);

const links = ref([
  {
    label: "Settings",
    icon: "i-heroicons-cog-6-tooth-solid",
    action: () => {},
  },
  {
    label: "Sign out",
    icon: "i-heroicons-arrow-right-end-on-rectangle-solid",
    action: () => {
      logOut();
    },
  },
]);

onBeforeMount(() => {
  const userDetails = getUser();
  userProfile.value = userDetails;
});
</script>
