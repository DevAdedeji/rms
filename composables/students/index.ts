/* eslint-disable camelcase */
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
      return data as User;
    } else {
      toast.add({
        title: "Error",
        description: "Student not found",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  const fetchStudentCourseBySession = async (
    id: string,
    semester: string,
    level: string,
  ) => {
    const { data } = await client
      .from("student_courses")
      .select("*")
      .eq("user_id", id)
      .filter("level", "eq", level)
      .filter("semester", "eq", semester);
    if (data) {
      return data;
    } else {
      toast.add({
        title: "Error",
        description: "Something went wrong, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  return {
    fetchStudentByMatricNo,
    fetchStudentById,
    fetchStudentCourseBySession,
  };
};

const signing_up = ref(false);
const signed_up = ref(false);
export const useSignUpStudent = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const { addUserToProfiles } = useUser();

  const signUpStudent = async (form: any) => {
    signing_up.value = true;
    const { data, error } = await client.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (data.user) {
      form.id = data.user.id;
      form.role = "student";
      delete form.password;
      const result = await addUserToProfiles(form);
      if (result) {
        signed_up.value = true;
        toast.add({
          title: "Success",
          description: "Account created successfully",
          icon: "i-heroicons-check-circle",
          color: "green",
        });
      } else {
        toast.add({
          title: "Error",
          description: "Couldn't sign you up, pls try again later",
          icon: "i-heroicons-x-circle",
          color: "red",
        });
      }
    }
    if (error) {
      toast.add({
        title: "Error",
        description: error.message || "Coudn't create account, pls try again",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    signing_up.value = false;
  };

  return { signing_up, signed_up, signUpStudent };
};

export const useStudentResult = () => {
  const client = useSupabaseClient();
  const toast = useToast();

  const fetchStudentSemesterResult = async (
    studentId: string,
    level: string,
    semester: string,
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
        description: "Couldn't fetch semester result, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };

  const updateStudentSemesterResult = async (formData: any) => {
    const { error } = await client.from("student_courses").upsert(formData);
    if (error) {
      toast.add({
        title: "Error",
        description: "Couldn't update student result, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Student result updated successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    }
  };

  return { fetchStudentSemesterResult, updateStudentSemesterResult };
};
