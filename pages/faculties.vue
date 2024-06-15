<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="flex items-center justify-end">
        <UButton
          icon="i-heroicons-plus-solid"
          @click="showAddFacultyModal = true"
          >Add Faculty</UButton
        >
      </div>
      <UTable
        :rows="faculties"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No faculties found!.',
        }"
      >
        <template #index-data="{ index }">
          <p>{{ index + 1 }}</p>
        </template>
        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton @click="openEditModal(row)">Edit</UButton>
            <UButton color="red" @click="deleteFaculty(row.id)">Delete</UButton>
          </div>
        </template>
      </UTable>
    </div>
    <LazyAddFacultyModal
      v-model="showAddFacultyModal"
      @added="newFacultyAdded = true"
    />
    <LazyEditFacultyModal
      v-model="showEditFacultyModal"
      :faculty="selectedFaculty"
      @updated="facultyUpdated = true"
    />
  </main>
</template>

<script setup lang="ts">
import { type facultyType } from "~/types/faculty";
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const toast = useToast();
const { fetchAllFaculties } = useFaculties();
const { deleteFaculty, deleted } = useDeleteFaculty();
const showAddFacultyModal = ref(false);
const newFacultyAdded = ref(false);
const showEditFacultyModal = ref(false);
const facultyUpdated = ref(false);
const selectedFaculty = ref<facultyType | null>(null);
const columns = [
  {
    key: "index",
    label: "S/N",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "actions",
  },
];

const { data, error, pending } = await useAsyncData(
  "faculties",
  async () => {
    const faculties = await fetchAllFaculties();
    newFacultyAdded.value = false;
    facultyUpdated.value = false;
    return faculties;
  },
  { watch: [deleted, newFacultyAdded, facultyUpdated] },
);

const faculties = computed(() => data.value);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const openEditModal = (data: facultyType) => {
  selectedFaculty.value = data;
  showEditFacultyModal.value = true;
};
</script>
