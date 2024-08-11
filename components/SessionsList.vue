<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <p>Select a session</p>
      </template>
      <div
        v-if="sessions && sessions.length"
        class="w-full flex flex-col gap-2"
      >
        <button
          v-for="session in sessions"
          :key="session.id"
          class="w-full py-2 border hover:bg-gray-200"
          @click="emits('selected', session)"
        >
          <p>
            <span class="mr-2 font-semibold">{{ session.name }}</span>
            <span>
              {{ formatDate(session.start_date) }} -
              {{ formatDate(session.end_date) }}
            </span>
          </p>
        </button>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const emits = defineEmits(["selected"]);
const model = defineModel({ type: Boolean, default: false });
const { fetchAllSessions } = useSessions();

const sessions = ref<any>([]);
const loading = ref(true);

const fetchSessions = async () => {
  loading.value = true;
  const fetchedSessions = await fetchAllSessions();
  sessions.value = fetchedSessions;
  loading.value = false;
};

onMounted(async () => {
  await fetchSessions();
});

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
