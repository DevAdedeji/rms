import { type ExamOfficerFormType } from "~/types/admin";
import { UserTypes, type User } from "~/types/auth/user";

export const useExamOfficers = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const adding = ref(false);
  const added = ref(false);

  const fetchExamOfficers = async () => {
    const officers = await client
      .from("user_profiles")
      .select("*")
      .filter("role", "eq", UserTypes.faculty);
    return officers.data as unknown as User[];
  };

  const addExamOfficer = async (form: ExamOfficerFormType) => {
    adding.value = true;
    const { data, error } = await client.auth.signUp({
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
      await addUserToProfiles(userInfo);
    }
    if (error) {
      toast.add({
        title: "Error",
        description: error.message || "Coudn't add exam officer, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    adding.value = false;
  };

  const addUserToProfiles = async (userInfo: any) => {
    const { error } = await client.from("user_profiles").upsert(userInfo);
    if (error) {
      toast.add({
        title: "Error",
        description: "Couldn't add exam officer, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Exam Officer added successfully",
        icon: "i-heroicons-check-circle",
        color: "primary",
      });
      added.value = true;
    }
  };

  return { addExamOfficer, adding, added, fetchExamOfficers };
};
