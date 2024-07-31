export const useCourses = () => {
  const client = useSupabaseClient();
  const { getUser } = useUser();

  const fetchCourses = async () => {
    const user = await getUser();
    const courses = await client
      .from("courses")
      .select("*")
      .filter("department->id", "eq", user.department.id.toString());
    return courses.data;
  };

  return {
    fetchCourses,
  };
};

const adding = ref(false);
const added = ref(false);
export const useAddCourse = () => {
  const client = useSupabaseClient();
  const toast = useToast();

  const addCourse = async (form: any) => {
    adding.value = true;
    const { data, error } = await client.from("courses").upsert(form);
    if (data) {
      toast.add({
        title: "Success",
        description: "Course added successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      added.value = true;
    }
    if (error) {
      toast.add({
        title: "Error",
        description: error.message || "Coudn't add course, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    adding.value = false;
  };

  return { added, adding, addCourse };
};

const updating = ref(false);
const updated = ref(false);
export const useUpdateCourse = () => {
  const client = useSupabaseClient();
  const toast = useToast();

  const updateCourse = async (formData: any) => {
    updating.value = true;
    updated.value = false;
    const { data, error } = await client.from("courses").upsert(formData);
    if (data) {
      toast.add({
        title: "Success",
        description: "Course updated successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't update course, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    updating.value = false;
    updated.value = true;
  };
  return { updateCourse, updated, updating };
};

const deleting = ref(false);
const deleted = ref(false);
export const useDeleteCourse = () => {
  const client = useSupabaseClient();
  const toast = useToast();

  const deleteCourse = async (id: string) => {
    deleted.value = false;
    deleting.value = true;
    const { error } = await client.from("courses").delete().eq("id", id);
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't delete course, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Course deleted successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      deleted.value = true;
      deleting.value = false;
    }
  };
  return { deleted, deleting, deleteCourse };
};
