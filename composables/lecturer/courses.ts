export const useLecturerCourses = () => {
  const client = useSupabaseClient();
  const { getUser } = useUser();

  const fetchCourses = async () => {
    const user = await getUser();
    const courses = await client
      .from("courses")
      .select("*")
      .filter("lecturer->>id", "eq", user.id);
    return courses.data;
  };

  return {
    fetchCourses,
  };
};
