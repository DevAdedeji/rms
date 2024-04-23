<template>
  <main class="flex">
    <Sidebar />
    <div class="ml-[270px]">
      <Topbar :title="selectedRoute" />
      <div class="mt-[60px]">
        <slot />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const selectedRoute = useSelectedRoute();
</script>
