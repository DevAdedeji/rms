import { UserTypes } from "~/types/auth/user";

export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser();
  const { getUser } = useUser();
  const userProfile = getUser();
  if (to.path !== "/auth/login") {
    if (!user.value) {
      return navigateTo("/auth/login");
    }
  } else if (user.value) {
    if (userProfile) {
      if (userProfile?.role === UserTypes.school) {
        return navigateTo("/school/dashboard");
      } else if (userProfile?.role === UserTypes.faculty) {
        return navigateTo("/exam-officer/dashboard");
      } else {
        return navigateTo("/student/dashboard");
      }
    }
  }
  if (to.path === "/") {
    if (!user.value) {
      return navigateTo("/auth/login");
    } else if (userProfile) {
      if (userProfile?.role === UserTypes.school) {
        return navigateTo("/school/dashboard");
      } else if (userProfile?.role === UserTypes.faculty) {
        return navigateTo("/exam-officer/dashboard");
      } else {
        return navigateTo("/student/dashboard");
      }
    }
  }
});
