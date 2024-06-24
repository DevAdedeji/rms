import { UserTypes } from "~/types/auth/user";
import { type User } from "~/types/auth/user";
export const useStudents = () => {
  const client = useSupabaseClient();
  const fetchAllStudents = async () => {
    const students = await client
      .from("user_profiles")
      .select("*")
      .eq("role", UserTypes.student);
    return students.data as unknown as User[];
  };
  return { fetchAllStudents };
};

export const useStudent = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const { fetchUserProfileDetails } = useUser();
  const fetchStudentByMatricNo = async (matricNo: string) => {
    const { data } = await client
      .from("user_profiles")
      .select("*")
      .eq("matric_no", matricNo)
      .single();
    let student: User;
    if (data) {
      student = data;
      const user = await fetchUserProfileDetails(student.id);
      return user;
    } else {
      toast.add({
        title: "Error",
        description: "Student not found",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  const fetchStudentById = async (id: string) => {
    const { data } = await client
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      return data;
    } else {
      toast.add({
        title: "Error",
        description: "Student not found",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  return { fetchStudentByMatricNo, fetchStudentById };
};
