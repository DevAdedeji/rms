interface loginDetailsType {
  email: string;
  password: string;
}

export const useAuth = () => {
  const client = useSupabaseClient();
  const toast = useToast();
  const { fetchUserProfileDetails, setUser } = useUser();
  const signingIn = ref(false);

  const login = async (formData: loginDetailsType) => {
    signingIn.value = true;
    const { data, error } = await client.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    signingIn.value = false;
    if (data) {
      if (data.user && data.session) {
        const user = await fetchUserProfileDetails(data.user.id);
        if (user) {
          setUser(user);
        }
        return navigateTo("/");
      }
    }
    if (error) {
      toast.add({
        title: "Error",
        description:
          error.message || "Something went wrong, pls try again later",
        icon: "i-heroicons-x-circle",
        color: "red",
      });
    }
  };
  const logOut = () => {
    localStorage.removeItem("user_profile");
    client.auth.signOut().then(() => {
      navigateTo("/auth/login");
    });
  };

  return { logOut, login, signingIn };
};

export const useUser = () => {
  const client = useSupabaseClient();
  const fetchUserProfileDetails = async (id: string) => {
    const { data } = await client
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      return data;
    }
  };
  const getUser = () => {
    const userDetails = localStorage.getItem("user_profile");
    let userProfile = null;
    if (userDetails) {
      userProfile = JSON.parse(userDetails);
    }
    return userProfile;
  };
  const setUser = (user: any) => {
    localStorage.setItem("user_profile", JSON.stringify(user));
  };
  return { fetchUserProfileDetails, setUser, getUser };
};
