<template>
  <main class="flex">
    <Sidebar />
    <div class="w-full ml-[270px]">
      <Topbar :title="selectedRoute" />
      <div class="mt-[60px] w-full">
        <slot />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const selectedRoute = useSelectedRoute();
</script>
