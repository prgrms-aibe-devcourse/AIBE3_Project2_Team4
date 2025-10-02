import { create } from "zustand";

interface Member {
  email: string;
  nickname: string;
  role: "freelancer" | "client" | "admin";
}

interface LoginState {
  member: Member | null;
  setMember: (member: Member | null) => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  member: { email: "aaa@naver.com", nickname: "정다솔", role: "client" },
  setMember: (member) => set({ member }),
}));
