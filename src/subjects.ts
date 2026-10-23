// Public content only. Future learning content must be scoped to stable subject IDs.
export const firstSubject = { id: "physics", name: "Fizika" } as const;
export const services = [
  {
    title: "Noldan o‘rganish",
    description:
      "Asosiy tushunchalardan boshlab, izchil o‘quv yo‘li bilan bosqichma-bosqich tayyorlanish.",
    icon: "book",
  },
  {
    title: "Darajani aniqlash",
    description:
      "Hozirgi bilimni tekshirish va qaysi mavzularga ko‘proq e’tibor berishni bilib olish.",
    icon: "compass",
  },
  {
    title: "Mustaqil modullar",
    description:
      "Kerakli mavzuni tanlab, aynan o‘sha bo‘lim ustida mustaqil ishlash.",
    icon: "grid",
  },
  {
    title: "Sinov imtihonlari",
    description:
      "Imtihonga yaqin shakldagi mashqlar orqali tayyorgarlikni sinab ko‘rish.",
    icon: "check",
  },
] as const;
export type AccountMode = "login" | "register";
export function parseAccountRoute(hash: string): AccountMode | null {
  return hash === "#/account/login"
    ? "login"
    : hash === "#/account/register"
      ? "register"
      : null;
}
