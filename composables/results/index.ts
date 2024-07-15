export const useResults = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const updatingResult = ref(false);

  const searchForSemesterResult = async (
    studentId: string,
    semester: string,
    level: number,
  ) => {
    const { data, error } = await client
      .from("results")
      .select("*")
      .filter("user_id", "eq", studentId)
      .filter("semester", "eq", semester)
      .filter("level", "eq", level);

    if (data) {
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description: error.message || "Couldn't fetch result",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

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

    updatingResult.value = false;
  };

  return {
    fetchUnapprovedResult,
    updatingResult,
    toggleResult,
    searchForSemesterResult,
  };
};
