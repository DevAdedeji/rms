const openMobileNav = ref(false);

export const useMobileNav = () => {
  const toggleMobileNav = () => {
    openMobileNav.value = !openMobileNav.value;
  };
  return { toggleMobileNav, openMobileNav };
};
