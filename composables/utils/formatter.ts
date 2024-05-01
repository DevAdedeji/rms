export const useFormatter = () => {
  const abbrevName = (name: string) => {
    const uppercaseLetters = name.match(/[A-Z]/g)?.slice(0, 2)?.join("") || "";
    return uppercaseLetters;
  };

  return { abbrevName };
};
