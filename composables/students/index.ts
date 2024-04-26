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
