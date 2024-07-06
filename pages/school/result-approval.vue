<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="flex items-center justify-between">
        <UInput
          v-model="q"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          :trailing="false"
          placeholder="Search student"
          class="w-2/5"
        />
      </div>
      <UTable
        :rows="filteredRows"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No Unapproved Results found!.',
        }"
        @select="openStudentPage"
      >
        <template #matric_no-data="{ row }">
          <p>{{ row.student.matric_no }}</p>
        </template>
        <template #name-data="{ row }">
          <p>{{ row.student.first_name + " " + row.student.last_name }}</p>
        </template>
        <template #faculty-data="{ row }">
          <p>{{ row.student.faculty.name }}</p>
        </template>
        <template #department-data="{ row }">
          <p>{{ row.student.department.name }}</p>
        </template>
        <template #session-data="{ row }">
          <p>{{ row.level + "L | " + row.semester }}</p>
        </template>
        <template #approved-data="{ row }">
          <span
            class="px-2 py-[2px] rounded"
            :class="
              row.approved
                ? 'bg-[#D1FFD1] text-[#008000]'
                : 'bg-[#FCE3EA] text-[#ED4C78]'
            "
          >
            {{ row.approved ? "Approved" : "Unapproved" }}
          </span>
        </template>
      </UTable>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const toast = useToast();
const router = useRouter();
const { fetchUnapprovedResult } = useResults();

const columns = [
  {
    key: "matric_no",
    label: "Matric No.",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "faculty",
    label: "Faculty",
  },
  {
    key: "department",
    label: "Department",
  },
  {
    key: "session",
    label: "Session",
  },
  {
    key: "approved",
    label: "Status",
  },
];

const { data, error, pending } = await useAsyncData(
  "students unapproved results",
  async () => {
    const results = await fetchUnapprovedResult();
    return results;
  },
);

const results = computed(() => data.value);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const q = ref("");
const filteredRows = ref([]);

const updateFilteredRows = () => {
  if (!q.value && results.value) {
    filteredRows.value = results.value;
  } else if (results.value) {
    filteredRows.value = results.value.filter((result) => {
      return Object.values(result).some((value) => {
        return String(value).toLowerCase().includes(q.value.toLowerCase());
      });
    });
  } else {
    filteredRows.value = [];
  }
};
const openStudentPage = (result: any) => {
  router.push(
    `/student/${result.user_id}/result?level=${result.level}&semester=${result.semester}`,
  );
};

watch(
  [q, results],
  () => {
    updateFilteredRows();
  },
  { immediate: true },
);
</script>
