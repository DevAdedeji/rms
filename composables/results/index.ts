export const useResults = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const updatingResult = ref(false);

  const fetchUnapprovedResult = async () => {
    const { data, error } = await client
      .from("results")
      .select("*")
      .filter("approved", "eq", false);
    if (data) {
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description: error.message || "Couldn't fetch results",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  const toggleResult = async (formData: any) => {
    updatingResult.value = true;
    const { error } = await client.from("results").upsert(formData);

    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't update result, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Result approved successfully",
        icon: "i-heroicons-check-circle",
        color: "primary",
      });
    }
  };

  return { fetchUnapprovedResult, updatingResult, toggleResult };
};
