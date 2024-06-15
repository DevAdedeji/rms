import { UserTypes, type User } from "~/types/auth/user";

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
          if (user.role === UserTypes.school) {
            return navigateTo("/school/dashboard");
          } else if (user.role === UserTypes.faculty) {
            return navigateTo("/exam-officer/dashboard");
          } else {
            return navigateTo("/student/dashboard");
          }
        } else {
          toast.add({
            title: "Error",
            description: "User Not Found",
            icon: "i-heroicons-x-circle",
            color: "red",
          });
          client.auth.signOut().then(() => {
            navigateTo("/auth/login");
          });
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
    toast.add({
      id: "user-log-out",
      title: "Info",
      description: "Signing out....",
      color: "primary",
    });
    localStorage.removeItem("user_profile");
    client.auth.signOut().then(() => {
      navigateTo("/auth/login");
    });
  };

  return { logOut, login, signingIn };
};

export const useUser = () => {
  const client = useSupabaseClient();

  const fetchUserProfileDetails = async (id: String) => {
    const { data } = await client
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      return data as User;
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
