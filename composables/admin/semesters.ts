export const useSemesters = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const fetchAllSemesters = async () => {
    const semesters = await client.from("semesters").select("*");
    return semesters.data;
  };
  const fetchActiveSemester = async () => {
    const { data, error } = await client
      .from("semesters")
      .select("*")
      .filter("is_active", "eq", true)
      .single();
    if (data) {
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description: "Pls refresh page, if error persists, reach out to admin",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return false;
    }
  };
  return { fetchAllSemesters, fetchActiveSemester };
};
