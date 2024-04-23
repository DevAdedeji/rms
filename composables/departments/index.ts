export const useDepartments = () => {
  const client = useSupabaseClient();
  const fetchAllDepts = async () => {
    const departments = await client.from("departments").select("*");
    return departments.data;
  };
  return { fetchAllDepts };
};
