import { type OfficersFormType } from "~/types/admin";
import { UserTypes, type User } from "~/types/auth/user";

export const useLecturers = () => {
  const client = useSupabaseClient();

  const fetchLecturers = async () => {
    const lectures = await client
      .from("user_profiles")
      .select("*")
      .filter("role", "eq", UserTypes.lecturer);
    return lectures.data as unknown as User[];
  };

  return {
    fetchLecturers,
  };
};

const adding = ref(false);
const added = ref(false);
export const useAddLecturer = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const { addUserToProfiles, getUserByEmail } = useUser();

  const addLecturer = async (form: OfficersFormType) => {
    adding.value = true;
    const { data, error } = await client.auth.admin.createUser({
      email: form.email,
      password: form.password,
    });
    if (data.user) {
      const userInfo = {
        id: data.user.id,
        role: "lecturer",
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        faculty: form.faculty,
        department: form.department,
      };
      const result = await addUserToProfiles(userInfo);
      if (result) {
        added.value = true;
        toast.add({
          title: "Success",
          description: "Lecturer added successfully",
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      } else {
        toast.add({
          title: "Error",
          description: "Couldn't add Lecturer, pls try again later",
          icon: "i-heroicons-x-circle",
          color: "red",
        });
      }
    }
    if (error) {
      if (
        error.status === 422 &&
        error.message.toLowerCase() ===
          "a user with this email address has already been registered"
      ) {
        const user = await getUserByEmail(form.email);
        if (user) {
          const userInfo = {
            id: user.id,
            role: "lecturer",
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            faculty: form.faculty,
            department: form.department,
          };
          const result = await addUserToProfiles(userInfo);
          if (result) {
            added.value = true;
            toast.add({
              title: "Success",
              description: "Lecturer added successfully",
              icon: "i-heroicons-check-circle",
              color: "green",
            });
          } else {
            toast.add({
              title: "Error",
              description: "Couldn't add Lecturer, pls try again later",
              icon: "i-heroicons-x-circle",
              color: "red",
            });
          }
          return;
        }
      }
      toast.add({
        title: "Error",
        description: error.message || "Coudn't add Lecturer, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    adding.value = false;
  };

  return { added, adding, addLecturer };
};

const updating = ref(false);
const updated = ref(false);
export const useUpdateLecturer = () => {
  const client = useSupabaseClient();
  const toast = useToast();

  const updateLecturer = async (formData: any) => {
    updating.value = true;
    updated.value = false;
    const { data, error } = await client.from("user_profiles").upsert(formData);
    if (data) {
      toast.add({
        title: "Success",
        description: "Lecturer info updated successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't update Lecturer info, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    updating.value = false;
    updated.value = true;
  };
  return { updated, updateLecturer, updating };
};

const deleting = ref(false);
const deleted = ref(false);
export const useDeleteLecturer = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const deleteLecturer = async (id: String) => {
    deleting.value = true;
    deleted.value = false;
    const { error } = await client.from("user_profiles").delete().eq("id", id);
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't delete Lecturer, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Lecturer deleted successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      deleted.value = true;
    }
    deleting.value = false;
  };
  return { deleted, deleteLecturer };
};
