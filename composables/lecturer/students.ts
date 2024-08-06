export const useCourseStudents = () => {
  const client = useSupabaseClient();
  const toast = useToast();

  const fetchCourseStudents = async (id: string) => {
    const students = await client
      .from("student_courses")
      .select("*")
      .filter("course->id", "eq", id);
    return students.data;
  };

  const saveCoursesStudentsScores = async (formData: any) => {
    const { error } = await client.from("student_courses").upsert(formData);
    if (error) {
      toast.add({
        title: "Error",
        description: "Couldn't update student scores, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return false;
    } else {
      toast.add({
        title: "Success",
        description: "Student scores updated successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      return true;
    }
  };

  return { fetchCourseStudents, saveCoursesStudentsScores };
};
