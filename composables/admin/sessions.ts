export const useSessions = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const fetchAllSessions = async () => {
    const sessions = await client.from("sessions").select("*");
    return sessions.data;
  };
  const fetchActiveSession = async () => {
    const { data, error } = await client
      .from("sessions")
      .select("*")
      .filter("is_active", "eq", true)
      .single();
    if (data) {
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description: "Pls refresh page, if error persists, reach out to admin",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return false;
    }
  };
  return { fetchAllSessions, fetchActiveSession };
};

const adding = ref(false);
const added = ref(false);
export const useAddSession = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const addSession = async (formData: any) => {
    adding.value = true;
    added.value = false;
    const { error } = await client.from("sessions").upsert(formData);
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't add session, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Session created successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    }
    adding.value = false;
    added.value = !added.value;
  };
  return { addSession, added, adding };
};

const updating = ref(false);
const updated = ref(false);
export const useUpdateSession = () => {
  const client = useSupabaseClient();
  const toast = useToast();

  const updateSession = async (formData: any) => {
    updating.value = true;
    updated.value = false;
    const { data, error } = await client.from("sessions").upsert(formData);
    if (data) {
      toast.add({
        title: "Success",
        description: "Session updated successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      return data;
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Couldn't update session, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
    updating.value = false;
    updated.value = true;
  };
  return { updateSession, updated, updating };
};

export const useStartSession = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const startSession = async (formData: any) => {
    const { error } = await client.from("sessions").upsert(formData);
    if (error) {
      toast.add({
        title: "Error",
        description: "Couldn't update session, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
      return false;
    } else {
      toast.add({
        title: "Success",
        description: "Session updated successfully",
        icon: "i-heroicons-check-circle",
        color: "green",
      });
      return true;
    }
  };
  return { startSession };
};
