<template>
  <header
    class="bg-gray-100 fixed top-0 left-[250px] right-0 h-[60px] border border-gray-200 flex items-center justify-between px-4"
  >
    <h1 class="text-xl">{{ title }}</h1>
    <UPopover>
      <UAvatar
        alt="Benjamin Canac"
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
          >
            <UIcon :name="link.icon" />
            <p>{{ link.label }}</p>
          </button>
        </div>
      </template>
    </UPopover>
  </header>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
});

const links = ref([
  {
    label: "Settings",
    icon: "i-heroicons-cog-6-tooth-solid",
  },
  {
    label: "Sign out",
    icon: "i-heroicons-arrow-right-end-on-rectangle-solid",
  },
]);
</script>
