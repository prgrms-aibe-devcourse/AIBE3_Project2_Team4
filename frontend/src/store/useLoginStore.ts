import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Member {
  email: string;
  nickname: string;
  role: "freelancer" | "client" | "admin" | "unassigned";
}

interface LoginState {
  member: Member | null;
  setMember: (member: Member | null) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
}

// export const useLoginStore = create<LoginState>((set) => ({
//   member: null,
//   setMember: (member) => set({ member }),
//   accessToken: null,
//   setAccessToken: (token) => set({ accessToken: token }),
//   clearAccessToken: () => set({ accessToken: null }),
// }));

export const useLoginStore = create<LoginState>()(
  persist(
    (set) => ({
      member: null,
      setMember: (member) => set({ member }),
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null, member: null }),
    }),
    {
      name: "token",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
