export const useStudentCourses = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const fetchCoursesByLevelAndSemester = async (
    level: Number,
    semester: string,
  ) => {
    const { data, error } = await client
      .from("courses")
      .select("*")
      .filter("level", "eq", level)
      .filter("semester", "eq", semester);
    if (data) {
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description: "Coudn't fetch courses, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  const fetchCoursesByFacultyAndSemester = async (
    id: string,
    semester: string,
  ) => {
    const { data, error } = await client
      .from("courses")
      .select("*")
      .filter("faculty->id", "eq", id)
      .filter("semester", "eq", semester);
    if (data) {
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description: "Coudn't fetch courses, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  const registerCourses = async (courses: any) => {
    try {
      const { error } = await client.from("student_courses").insert(courses);
      if (error) {
        toast.add({
          title: "Error",
          description: "Something went wrong, pls try again",
          icon: "i-heroicons-x-circle",
          color: "red",
        });
        return false;
      } else {
        toast.add({
          title: "Success",
          description: "Successfully registered courses",
          icon: "i-heroicons-check-circle",
          color: "green",
        });
        return true;
      }
    } catch (e) {
      toast.add({
        title: "Error",
        description: "Something went wrong, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  const fetchRegisteredCourses = async (
    level: number,
    semester: string,
    studentId: string,
  ) => {
    const { data, error } = await client
      .from("student_courses")
      .select("*")
      .filter("student_id", "eq", studentId)
      .filter("level", "eq", level)
      .filter("semester", "eq", semester)
      .filter("registered", "eq", true);
    if (data) {
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description: "Couldn't fetch registered courses, pls refresh",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  const registerUpdatedCourses = async (courses: any) => {
    try {
      const coursesToUpdate = courses.filter(
        (course: any) => course.id !== undefined && course.id !== null,
      );

      const coursesToInsert = courses.filter(
        (course: any) => course.id === undefined || course.id === null,
      );

      const { error } = await client
        .from("student_courses")
        .upsert(coursesToUpdate)
        .select();
      if (error) {
        toast.add({
          title: "Error",
          description: "Something went wrong, pls try again",
          icon: "i-heroicons-x-circle",
          color: "red",
        });
        return false;
      } else {
        const { error } = await client
          .from("student_courses")
          .insert(coursesToInsert);
        if (error) {
          toast.add({
            title: "Error",
            description: "Something went wrong, pls try again 2",
            icon: "i-heroicons-x-circle",
            color: "red",
          });
          return false;
        } else {
          toast.add({
            title: "Success",
            description: "Successfully updated registered courses",
            icon: "i-heroicons-check-circle",
            color: "green",
          });
          return true;
        }
      }
    } catch (e) {
      toast.add({
        title: "Error",
        description: "Something went wrong, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  return {
    fetchCoursesByLevelAndSemester,
    fetchCoursesByFacultyAndSemester,
    registerCourses,
    fetchRegisteredCourses,
    registerUpdatedCourses,
  };
};
