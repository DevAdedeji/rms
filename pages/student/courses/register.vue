<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col gap-10 py-10">
      <h1 class="font-semibold text-2xl">
        Course registration from 100 Level to Final year
      </h1>
      <div class="w-full">
        <UCard>
          <template #header>
            <p>Academic Sessions</p>
          </template>
          <div v-for="(session, index) in academicSessions" :key="index">
            <button
              class="p-4 border-b-2 border-gray-200 w-full hover:bg-gray-200 text-left flex items-center justify-between rounded"
              :class="session.active ? '' : 'opacity-50 cursor-not-allowed'"
              :disabled="!session.active"
            >
              <p>{{ session.level }}L | {{ session.semester }} Semester</p>
              <UIcon name="i-heroicons-chevron-right" />
            </button>
          </div>
        </UCard>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const { fetchStudentById } = useStudent();
const { getUser } = useUser();
const user = getUser();
const toast = useToast();

const studentId = user.id;
const academicSessions = computed(() => {
  const baseSessions = [
    {
      level: 100,
      semester: "harmattan",
    },
    {
      level: 100,
      semester: "rain",
    },
    {
      level: 200,
      semester: "harmattan",
    },
    {
      level: 200,
      semester: "rain",
    },
    {
      level: 300,
      semester: "harmattan",
    },
    {
      level: 300,
      semester: "rain",
    },
    {
      level: 400,
      semester: "harmattan",
    },
    {
      level: 400,
      semester: "rain",
    },
  ];

  const extendedSessions = [
    ...baseSessions,
    {
      level: 500,
      semester: "harmattan",
    },
    {
      level: 500,
      semester: "rain",
    },
  ];
  if (student.value && student.value.cert && student.value.level) {
    const sessions =
      student.value.cert.id === 1 ? extendedSessions : baseSessions;

    // Ensure that student.value.level is a number
    const studentLevel =
      typeof student.value.level === "number"
        ? student.value.level
        : Number(student.value.level);

    return sessions.map((session) => ({
      ...session,
      active: session.level <= studentLevel,
    }));
  } else {
    return extendedSessions.map((session) => ({
      ...session,
      active: false,
    }));
  }
});

const { data, error } = await useAsyncData(
  "a student register course page",
  async () => {
    const student = await fetchStudentById(studentId);
    return student;
  },
);
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const student = computed(() => data.value);
</script>
