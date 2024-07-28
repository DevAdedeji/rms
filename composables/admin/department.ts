import { type departmentType } from "~/types/department";

export const useDepartments = () => {
  const client = useSupabaseClient();
  const fetchAllDepts = async () => {
    const departments = await client.from("departments").select("*");
    return departments.data as unknown as departmentType[];
  };
  const fetchDepartmentsByFacultyId = async (id: string) => {
    const departments = await client
      .from("departments")
      .select("*")
      .filter("faculty->id", "eq", id);
    return departments.data as unknown as departmentType[];
  };
  return { fetchAllDepts, fetchDepartmentsByFacultyId };
};

export const useAddDepartment = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const adding = ref(false);
  const added = ref(false);
  const addDepartment = async (formData: any) => {
    adding.value = true;
    added.value = false;
    const { data, error } = await client.from("departments").upsert(formData);
    if (data) {
      toast.add({
        title: "Success",
        description: "Department created successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't add department, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    adding.value = false;
    added.value = !added.value;
  };
  return { addDepartment, added, adding };
};

export const useUpdateDepartment = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const updating = ref(false);
  const updated = ref(false);
  const updateDepartment = async (formData: any) => {
    updating.value = true;
    updated.value = false;
    const { data, error } = await client.from("departments").upsert(formData);
    if (data) {
      toast.add({
        title: "Success",
        description: "Department updated successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't update department, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    updating.value = false;
    updated.value = true;
  };
  return { updateDepartment, updated, updating };
};

export const useDeleteDepartment = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const deleting = ref(false);
  const deleted = ref(false);
  const deleteDepartment = async (id: string) => {
    deleted.value = false;
    deleting.value = true;
    const { error } = await client.from("departments").delete().eq("id", id);
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't delete department, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Department deleted successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      deleted.value = true;
      deleting.value = false;
    }
  };
  return { deleted, deleting, deleteDepartment };
};
