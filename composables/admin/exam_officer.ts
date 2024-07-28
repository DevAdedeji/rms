import { type OfficersFormType } from "~/types/admin";
import { UserTypes, type User } from "~/types/auth/user";

export const useExamOfficers = () => {
  const client = useSupabaseClient();
  const { getUser } = useUser();

  const fetchExamOfficers = async () => {
    const officers = await client
      .from("user_profiles")
      .select("*")
      .filter("role", "eq", UserTypes.faculty);
    return officers.data as unknown as User[];
  };

  const fetchExamOfficerStudent = async () => {
    const user = getUser();
    const departmentId = user.department.id;
    const { data } = await client
      .from("user_profiles")
      .select("*")
      .eq("role", UserTypes.student)
      .filter("department->id", "eq", departmentId);
    return data as unknown as User[];
  };

  return {
    fetchExamOfficers,
    fetchExamOfficerStudent,
  };
};

const adding = ref(false);
const added = ref(false);
export const useAddExamOfficer = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const { addUserToProfiles, getUserByEmail } = useUser();

  const addExamOfficer = async (form: OfficersFormType) => {
    adding.value = true;
    const { data, error } = await client.auth.admin.createUser({
      email: form.email,
      password: form.password,
    });
    if (data.user) {
      const userInfo = {
        id: data.user.id,
        role: "exam_officer",
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
          description: "Exam Officer added successfully",
          icon: "i-heroicons-check-circle",
          color: "primary",
        });
      } else {
        toast.add({
          title: "Error",
          description: "Couldn't add Exam Officer, pls try again later",
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
            role: "exam_officer",
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
              description: "Exam Officer added successfully",
              icon: "i-heroicons-check-circle",
              color: "primary",
            });
          } else {
            toast.add({
              title: "Error",
              description: "Couldn't add Exam Officer, pls try again later",
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

  return { added, adding, addExamOfficer };
};

const updating = ref(false);
const updated = ref(false);
export const useUpdateExamOfficer = () => {
  const client = useSupabaseClient();
  const toast = useToast();

  const updateExamOfficer = async (formData: any) => {
    updating.value = true;
    updated.value = false;
    const { data, error } = await client.from("user_profiles").upsert(formData);
    if (data) {
      toast.add({
        title: "Success",
        description: "Exam Officer info updated successfully",
        icon: "i-heroicons-check-circle",
        color: "primary",
      });
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message ||
          "Couldn't update exam officer info, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    updating.value = false;
    updated.value = true;
  };
  return { updated, updateExamOfficer, updating };
};

const deleting = ref(false);
const deleted = ref(false);
export const useDeleteExamOfficer = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const deleteExamOfficer = async (id: string) => {
    deleting.value = true;
    deleted.value = false;
    const { error } = await client.from("user_profiles").delete().eq("id", id);
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't delete exam officer, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Exam officer deleted successfully",
        icon: "i-heroicons-check-circle",
        color: "primary",
      });
      deleted.value = true;
    }
    deleting.value = false;
  };
  return { deleted, deleteExamOfficer };
};
