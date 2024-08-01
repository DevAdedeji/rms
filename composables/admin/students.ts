import { type User } from "~/types/auth/user";
const promoting = ref(false);
const students = ref<User[]>([]);
export const usePromoteStudents = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const { fetchAllStudents } = useStudents();

  const promoteStudents = async () => {
    promoting.value = true;
    students.value = await fetchAllStudents();
    if (students.value.length) {
      for (const student of students.value) {
        let nextLevel = Number(student.level);
        let graduated = false;

        if (student.cert && student.cert.id === 1) {
          if (Number(student.level) < 500) {
            nextLevel += 100;
          } else {
            graduated = true;
          }
        } else if (student.cert && student.cert.id === 2) {
          if (Number(student.level) < 400) {
            nextLevel += 100;
          } else {
            graduated = true;
          }
        }

        // Update the student's level or graduation status
        await updateStudent(student.id, nextLevel, graduated);
      }
      toast.add({
        title: "Success",
        description: "Done promoting students",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      promoting.value = false;
    }
  };

  const updateStudent = async (
    id: String,
    nextLevel: number,
    graduated: boolean,
  ) => {
    const studentNewInfo: any = {
      id,
      level: nextLevel,
      graduated,
    };
    await client.from("user_profiles").upsert(studentNewInfo);
  };

  return { promoteStudents, promoting };
};
