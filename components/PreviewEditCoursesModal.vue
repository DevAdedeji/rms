<template>
  <UModal v-model="model">
    <UCard class="min-w-[800px] mx-auto">
      <template #header>
        <div class="w-full flex items-center justify-between">
          <h1 class="font-semibold">Selected Courses</h1>
          <UButton
            icon="i-heroicons-x-mark"
            size="md"
            class="text-black"
            variant="ghost"
            @click="model = false"
          ></UButton>
        </div>
      </template>
      <div class="flex flex-col gap-4 w-full">
        <UTable
          :rows="editedCourses"
          :columns="columns"
          :empty-state="{
            icon: 'i-heroicons-circle-stack-20-solid',
            label: 'No courses selected!.',
          }"
        >
          <template #course_code-data="{ row }">
            <p>{{ row.course.course_code }}</p>
          </template>
          <template #title-data="{ row }">
            <p>{{ row.course.title }}</p>
          </template>
        </UTable>
        <UButton
          class="self-end"
          size="xl"
          :loading="saving"
          @click="emits('checked')"
          >Save</UButton
        >
      </div>
    </UCard>
  </UModal>
</template>
<script setup lang="ts">
const emits = defineEmits(["checked"]);
const model = defineModel({ type: Boolean, default: false });
const props = defineProps<{
  courses: any[];
  saving: boolean;
}>();
const columns = [
  {
    key: "course_code",
    label: "Course Code",
  },
  {
    key: "title",
    label: "Title",
  },
  {
    key: "unit",
    label: "Unit",
  },
];

const editedCourses = ref<any[]>([]);

watch(
  () => props.courses,
  () => {
    editedCourses.value = props.courses.filter(
      (course: any) => course.registered,
    );
  },
  { immediate: true },
);
</script>
