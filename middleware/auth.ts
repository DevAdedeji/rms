import { UserTypes } from "~/types/auth/user";

export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser();
  const { getUser } = useUser();
  const userProfile = getUser();

  const roleAllowedPaths: any = {
    [UserTypes.school]: [
      "/admin/faculties",
      "/admin/departments",
      "/admin/head-of-departments",
      "/admin/exam-officers",
      "/admin/sessions",
    ],
    [UserTypes.faculty]: [
      "/exam-officer/lecturers",
      "/exam-officer/students",
      "/exam-officer/courses",
      "/student/info",
    ],
    [UserTypes.student]: [
      "/student/results",
      "/student/courses",
      "/student/info",
    ],
    [UserTypes.lecturer]: ["/lecturer/courses"],
  };

  if (!user.value) {
    if (to.path !== "/auth/login") {
      return navigateTo("/auth/login");
    }
  } else {
    const routeSegments = to.path.split("/");
    const baseRoute = `/${routeSegments[1]}/${routeSegments[2]}`;
    const roleRedirection: any = {
      [UserTypes.school]: "/admin/faculties",
      [UserTypes.faculty]: "/exam-officer/lecturers",
      [UserTypes.student]: "/student/results",
      [UserTypes.lecturer]: "/lecturer/courses",
    };

    const redirectTo = roleRedirection[userProfile?.role];
    const isAllowedToAccess =
      roleAllowedPaths[userProfile?.role].includes(baseRoute);

    if (to.path === "/") {
      return navigateTo(redirectTo);
    }

    if (!isAllowedToAccess) {
      return navigateTo(redirectTo);
    }
  }
});
