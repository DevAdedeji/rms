export default defineAppConfig({
  ui: {
    primary: "black",
    gray: "cool",
    notifications: {
      position: "top-0 bottom-auto",
    },
    input: {
      base: "h-[40px]",
    },
    button: {
      base: "h-[40px]",
    },
    table: {
      base: "border border-gray-200 rounded-md",
      th: {
        base: "bg-gray-100",
      },
    },
    select: {
      base: "!h-[40px]",
    },
  },
});
