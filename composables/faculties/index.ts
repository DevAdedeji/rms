export const useFaculties = () => {
  const client = useSupabaseClient();
  const fetchAllFaculties = async () => {
    const faculties = await client.from("faculties").select("*");
    return faculties.data;
  };
  return { fetchAllFaculties };
};
