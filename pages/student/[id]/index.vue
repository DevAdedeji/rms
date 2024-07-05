<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div v-if="!pending && student" class="flex flex-col py-10 gap-10">
      <div
        class="flex flex-col items-center gap-3 text-center border border-gray-300 rounded-md p-4 cover-bg"
      >
        <UAvatar :alt="name" size="3xl" class="!border !border-gray-300" />
        <div class="flex flex-col gap-2">
          <p class="text-2xl">{{ name }}</p>
          <p>Matric Number: {{ student.matric_no }}</p>
        </div>
      </div>
      <div class="flex items-start gap-2">
        <div class="w-2/5">
          <UCard>
            <template #header>
              <p>Profile</p>
            </template>

            <div class="flex flex-col gap-4 text-[14px]">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-user" />
                <p>{{ name }}</p>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-envelope" />
                <p>{{ student.email }}</p>
              </div>
              <div v-if="student.faculty" class="flex items-center gap-2">
                <UIcon name="i-heroicons-building-library" />
                <p>{{ student.faculty.name }}</p>
              </div>
              <div v-if="student.department" class="flex items-center gap-2">
                <UIcon name="i-heroicons-building-office" />
                <p>{{ student.department.name }}</p>
              </div>

              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-academic-cap" />
                <p>
                  <span class="font-medium">Matric No:</span>
                  {{ student.matric_no }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-academic-cap" />
                <p>
                  <span class="font-medium">Admission Year:</span>
                  {{ student.year_of_admission }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-academic-cap" />
                <p>
                  <span class="font-medium">Expected Graduation Year:</span>
                  {{ expectedGraduationYear }}
                </p>
              </div>
            </div>

            <Placeholder class="h-32" />
          </UCard>
        </div>
        <div class="w-3/5">
          <UCard>
            <template #header>
              <p>Academic Sessions</p>
            </template>
            <div v-for="(session, index) in academicSessions" :key="index">
              <button
                class="p-4 border-b-2 border-gray-200 w-full hover:bg-gray-200 text-left flex items-center justify-between rounded"
                :class="session.active ? '' : 'opacity-50 cursor-not-allowed'"
                :disabled="!session.active"
                @click="openStudentResultPage(session)"
              >
                <p>{{ session.level }}L | {{ session.semester }} Semester</p>
                <UIcon name="i-heroicons-chevron-right" />
              </button>
            </div>
          </UCard>
        </div>
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
const toast = useToast();
const route = useRoute();
const router = useRouter();
const studentId = route.params.id as string;

const { data, error, pending } = await useAsyncData("a student", async () => {
  const student = await fetchStudentById(studentId);
  return student;
});
if (error.value) {
  toast.add({
    title: "Error",
    description:
      (error.value.message as string) || (error.value.data as string),
    color: "red",
  });
}

const student = computed(() => data.value);

const name = computed(() =>
  student.value
    ? student.value.first_name + " " + student.value.last_name
    : "Jane Doe",
);

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

const expectedGraduationYear = computed(() => {
  let year;
  if (student.value && student.value.cert && student.value.year_of_admission) {
    if (student.value.cert.id === 1) {
      year = 5;
    } else {
      year = 4;
    }
    return student.value.year_of_admission + year;
  }
  return "N/A";
});

const openStudentResultPage = (session: any) => {
  router.push(
    `/student/${studentId}/result?level=${session.level}&semester=${session.semester}`,
  );
};
</script>

<style scoped>
.cover-bg {
  background-image: url("../../../assets/images/cover.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
