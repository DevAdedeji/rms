import { type facultyType } from "~/types/faculty";

export const useFaculties = () => {
  const client = useSupabaseClient();
  const fetchAllFaculties = async () => {
    const faculties = await client.from("faculties").select("*");
    return faculties.data as unknown as facultyType[];
  };
  return { fetchAllFaculties };
};

export const useUpdateFaculty = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const updating = ref(false);
  const updated = ref(false);
  const updateFaculty = async (formData: any) => {
    updating.value = true;
    updated.value = false;
    const { data, error } = await client.from("faculties").upsert(formData);
    if (data) {
      toast.add({
        title: "Success",
        description: "Faculty updated successfully",
        icon: "i-heroicons-check-circle",
        color: "primary",
      });
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't update faculty, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    updating.value = false;
    updated.value = true;
  };
  return { updateFaculty, updated, updating };
};

export const useAddFaculty = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const adding = ref(false);
  const added = ref(false);
  const addFaculty = async (formData: any) => {
    adding.value = true;
    added.value = false;
    const { data, error } = await client.from("faculties").upsert(formData);
    if (data) {
      toast.add({
        title: "Success",
        description: "Faculty created successfully",
        icon: "i-heroicons-check-circle",
        color: "primary",
      });
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't add faculty, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    adding.value = false;
    added.value = !added.value;
  };
  return { addFaculty, added, adding };
};

export const useDeleteFaculty = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const deleting = ref(false);
  const deleted = ref(false);
  const deleteFaculty = async (id: string) => {
    deleted.value = false;
    deleting.value = true;
    const { error } = await client.from("faculties").delete().eq("id", id);
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't delete faculty, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Faculty deleted successfully",
        icon: "i-heroicons-check-circle",
        color: "primary",
      });
      deleted.value = true;
      deleting.value = false;
    }
  };
  return { deleted, deleting, deleteFaculty };
};
