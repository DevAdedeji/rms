<template>
  <div class="w-full">
    <form class="flex flex-col gap-6" @submit.prevent="submitForm">
      <UFormGroup
        label="Email Address"
        :error="$v.email.$error && 'You must enter an email'"
      >
        <UInput
          v-model="form.email"
          placeholder="Enter your email"
          type="email"
          icon="i-heroicons-user"
          :trailing-icon="
            $v.email.$error
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

const { signingIn, login } = useAuth();

const form = ref({
  email: "",
  password: "",
});

const rules = computed(() => {
  return {
    email: { required },
    password: { required },
  };
});

const $v = useVuelidate(rules, form);

const submitForm = async () => {
  const isFormCorrect = await $v.value.$validate();
  if (isFormCorrect) {
    await login(form.value);
  }
};
</script>
