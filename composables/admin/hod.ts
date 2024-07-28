import { UserTypes, type User } from "~/types/auth/user";
import { type OfficersFormType } from "~/types/admin";
export const useHODs = () => {
  const client = useSupabaseClient();

  const fetchAllHODs = async () => {
    const headOfDepartments = await client
      .from("user_profiles")
      .select("*")
      .eq("role", UserTypes.hod);
    return headOfDepartments.data as unknown as User[];
  };

  return { fetchAllHODs };
};

const added = ref(false);
const adding = ref(false);
export const useAddHOD = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const { addUserToProfiles, getUserByEmail } = useUser();

  const addHOD = async (form: OfficersFormType) => {
    adding.value = true;
    const { data, error } = await client.auth.admin.createUser({
      email: form.email,
      password: form.password,
    });
    if (data.user) {
      const userInfo = {
        id: data.user.id,
        role: "hod",
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
          description: "HOD added successfully",
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      } else {
        toast.add({
          title: "Error",
          description: "Couldn't add HOD, pls try again later",
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
            role: "hod",
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
              description: "HOD added successfully",
              icon: "i-heroicons-check-circle",
              color: "primary",
            });
          } else {
            toast.add({
              title: "Error",
              description: "Couldn't add HOD, pls try again later",
              icon: "i-heroicons-x-circle",
              color: "red",
            });
          }
          return;
        }
      }
      toast.add({
        title: "Error",
        description: error.message || "Coudn't add exam officer, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    adding.value = false;
  };

  return { addHOD, adding, added };
};

const updating = ref(false);
const updated = ref(false);
export const useUpdateHOD = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const updateHOD = async (formData: any) => {
    updating.value = true;
    updated.value = false;
    const { data, error } = await client.from("user_profiles").upsert(formData);
    if (data) {
      toast.add({
        title: "Success",
        description: "HOD info updated successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't update HOD info, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    updating.value = false;
    updated.value = true;
  };

  return { updateHOD, updated, updating };
};

const deleting = ref(false);
const deleted = ref(false);
export const useDeleteHOD = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const deleteHOD = async (id: String) => {
    deleted.value = false;
    deleting.value = true;
    const { error } = await client.from("user_profiles").delete().eq("id", id);
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't delete user, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "User deleted successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      deleted.value = true;
    }
    deleting.value = false;
  };

  return { deleteHOD, deleted };
};
