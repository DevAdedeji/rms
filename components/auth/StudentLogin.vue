<template>
  <div class="w-full">
    <form class="flex flex-col gap-6" @submit.prevent="submitForm">
      <UFormGroup
        label="Matric Number"
        :error="$v.matricNo.$error && 'You must enter your matric number'"
      >
        <UInput
          v-model="form.matricNo"
          placeholder="191263"
          icon="i-heroicons-user"
          :trailing-icon="
            $v.matricNo.$error
              ? 'i-heroicons-exclamation-triangle-20-solid'
              : undefined
          "
        />
      </UFormGroup>
      <UFormGroup
        label="Password"
        :error="$v.password.$error && 'You must enter a password'"
      >
        <UInput
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          icon="i-heroicons-key"
          :trailing-icon="
            $v.password.$error
              ? 'i-heroicons-exclamation-triangle-20-solid'
              : undefined
          "
        />
      </UFormGroup>
      <UButton
        type="submit"
        :loading="signingIn"
        class="flex items-center justify-center"
        >Login</UButton
      >
    </form>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { fetchStudentByMatricNo } = useStudent();
const { signingIn, login } = useAuth();
const toast = useToast();

const form = ref({
  matricNo: "",
  password: "",
});

const rules = computed(() => {
  return {
    matricNo: { required },
    password: { required },
  };
});

const $v = useVuelidate(rules, form);

const submitForm = async () => {
  const isFormCorrect = await $v.value.$validate();
  if (isFormCorrect) {
    signingIn.value = true;
    const student = await fetchStudentByMatricNo(form.value.matricNo);
    if (student) {
      const data = { email: student.email, password: form.value.password };
      await login(data);
    } else {
      toast.add({
        title: "Error",
        description: "Student not found",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      signingIn.value = false;
    }
  }
};
</script>
