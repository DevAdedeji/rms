<template>
  <main class="bg-white min-h-screen w-full pr-5">
    <div class="flex flex-col h-full items-center justify-center py-10 gap-10">
      <div class="w-full min-h-[70vh] flex items-center justify-center">
        <form
          class="flex flex-col gap-6 w-[50%] px-10 pt-10 pb-20 rounded-md shadow-xl"
          @submit.prevent="searchForResult"
        >
          <h2 class="text-center text-2xl py-6">Select Academic Session</h2>
          <UFormGroup label="Your Level">
            <USelectMenu
              v-model="form.level"
              :options="levelOptions"
              placeholder="Select Level"
              required
            />
          </UFormGroup>
          <UFormGroup label="Semester">
            <USelectMenu
              v-model="form.semester"
              :options="semesterOptions"
              placeholder="Select Semester"
              value-attribute="value"
              required
            />
          </UFormGroup>
          <div class="flex items-center justify-center">
            <UButton class="px-10" size="xl" type="submit" :loading="searching">
              Search
            </UButton>
          </div>
        </form>
      </div>
    </div>
    <LazyResultNotFoundModal v-model="showResultNotFoundModal" />
    <LazyResultNotApprovedModal v-model="showResultNotYetApprovedModal" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { getUser } = useUser();
const { searchForSemesterResult } = useResults();

const student = getUser();

const semesterOptions = ref([
  {
    value: "rain",
    label: "Rain Semester",
  },
  {
    value: "harmattan",
    label: "Harmattan Semester",
  },
]);

const levelOptions = computed(() => {
  const baseLevels = ["100", "200", "300", "400"];
  const extendedLevels = [...baseLevels, "500"];
  if (student && student.cert && student.level) {
    let levels = student.cert.id === 1 ? extendedLevels : baseLevels;

    const studentLevel =
      typeof student.level === "number" ? student.level : Number(student.level);

    levels = levels.filter((level) => level <= studentLevel);
    return levels;
  } else {
    return extendedLevels;
  }
});

const form = ref({
  level: "",
  semester: "",
});
const searching = ref(false);
const result = ref<any>();
const showResultNotFoundModal = ref(false);
const showResultNotYetApprovedModal = ref(false);

const searchForResult = async () => {
  searching.value = true;
  result.value = await searchForSemesterResult(
    student.id,
    form.value.semester,
    Number(form.value.level),
  );

  if (result.value) {
    if (result.value.length === 0) {
      showResultNotFoundModal.value = true;
    } else {
      result.value = result.value[0];
      if (!result.value.approved) {
        showResultNotYetApprovedModal.value = true;
      }
    }
  }
  searching.value = false;
};
</script>
