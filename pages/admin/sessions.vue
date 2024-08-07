<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-6 py-10">
      <div class="">
        <UButton
          size="xl"
          class="px-6 py-6 text-lg"
          :loading="promoting"
          :disabled="promoting"
          @click="promoteStudents"
          >Promote All Students</UButton
        >
      </div>
      <div class="flex items-center justify-between">
        <UInput
          v-model="q"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          color="white"
          :trailing="false"
          placeholder="Search session"
          class="w-2/5"
        />
        <UButton
          icon="i-heroicons-plus-solid"
          @click="showAddSessionModal = true"
          >Add New Session</UButton
        >
      </div>
      <UTable
        :rows="formattedSessions"
        :loading="pending"
        :columns="columns"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No sessions found!.',
        }"
      >
        <template #index-data="{ index }">
          <p>{{ index + 1 }}</p>
        </template>
        <template #start_date-data="{ row }">
          <p>{{ formatDate(row.start_date) }}</p>
        </template>
        <template #end_date-data="{ row }">
          <p>{{ formatDate(row.end_date) }}</p>
        </template>
        <template #is_active-data="{ row }">
          <UIcon
            v-if="row.is_active"
            name="i-heroicons-check-circle-solid"
            class="text-green-600 text-2xl"
          />
          <UIcon
            v-else
            name="i-heroicons-x-circle-solid"
            class="text-red-600 text-2xl"
          />
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>
    </div>
    <LazyAdminAddSession v-model="showAddSessionModal" />
    <LazyAdminEditSession
      v-model="showEditSessionModal"
      :session="selectedSession"
    />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { promoteStudents, promoting } = usePromoteStudents();
const { added } = useAddSession();
const { updated } = useUpdateSession();
const { startSession } = useStartSession();
const { fetchAllSessions } = useSessions();
const toast = useToast();
const showAddSessionModal = ref(false);
const showEditSessionModal = ref(false);
const selectedSession = ref({});
const formattedSessions = ref<any>([]);
const q = ref("");

const { data, error, pending, refresh } = await useAsyncData(
  "deparments",
  async () => {
    const sessions = await fetchAllSessions();
    added.value = false;
    updated.value = false;
    return sessions;
  },
  { watch: [added, updated] },
);
const sessions = computed(() => data.value);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const updateFilteredRows = () => {
  if (!q.value && sessions.value) {
    formattedSessions.value = sessions.value;
  } else if (sessions.value) {
    formattedSessions.value = sessions.value.filter((session: any) => {
      return session.name.toLowerCase().includes(q.value.toLowerCase());
    });
  } else {
    formattedSessions.value = [];
  }
};

watch(
  [q, sessions],
  () => {
    updateFilteredRows();
  },
  { immediate: true },
);

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
    key: "start_date",
    label: "Start Date",
  },
  {
    key: "end_date",
    label: "End Date",
  },
  {
    key: "is_active",
    label: "Active",
  },
  {
    key: "actions",
  },
];

const items = computed(() => (row: any) => {
  if (row.is_active) {
    return [
      [
        {
          label: "Edit",
          icon: "i-heroicons-pencil-square-20-solid",
          click: () => {
            openEditModal(row);
          },
        },
      ],
    ];
  } else {
    return [
      [
        {
          label: "Edit",
          icon: "i-heroicons-pencil-square-20-solid",
          click: () => {
            openEditModal(row);
          },
        },
        {
          label: "Start Session",
          icon: "i-heroicons-forward-20-solid",
          click: () => {
            handleStartSession(row);
          },
        },
      ],
    ];
  }
});

const openEditModal = (row: any) => {
  showEditSessionModal.value = true;
  selectedSession.value = row;
};

const handleStartSession = async (row: any) => {
  const selectedId = row.id;
  if (selectedId && formattedSessions.value.length) {
    formattedSessions.value.forEach((session: any) => {
      if (session.id === selectedId) {
        session.is_active = true;
      } else {
        session.is_active = false;
      }
    });
    await startSession(formattedSessions.value);
    refresh();
  }
};

const formatDate = (datetime: string): string => {
  const [datePart] = datetime.split("T");
  const [year, month, day] = datePart.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDate = `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
  return `${formattedDate}`;
};
</script>
