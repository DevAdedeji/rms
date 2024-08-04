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
      "/admin/promotion",
    ],
    [UserTypes.faculty]: [
      "/exam-officer/dashboard",
      "/exam-officer/lecturers",
      "/exam-officer/students",
      "/exam-officer/courses",
    ],
    [UserTypes.student]: [
      "/student/results",
      "/student/courses/history",
      "/student/courses/register",
      "/student/courses/edit",
    ],
    [UserTypes.lecturer]: ["/lecturer/courses"],
  };

  if (!user.value) {
    if (to.path !== "/auth/login") {
      return navigateTo("/auth/login");
    }
  } else {
    const roleRedirection: any = {
      [UserTypes.school]: "/admin/faculties",
      [UserTypes.faculty]: "/exam-officer/dashboard",
      [UserTypes.student]: "/student/results",
      [UserTypes.lecturer]: "/lecturer/courses",
    };

    const redirectTo = roleRedirection[userProfile?.role];
    const isAllowedToAccess = roleAllowedPaths[userProfile?.role].includes(
      to.path,
    );

    if (to.path === "/") {
      return navigateTo(redirectTo);
    }

    if (!isAllowedToAccess) {
      return navigateTo(redirectTo);
    }
  }
});
