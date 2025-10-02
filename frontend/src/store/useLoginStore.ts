import { create } from 'zustand';

interface Member {
    email : string;
    nickname : string;
    role : "freelancer" | "client" | "admin";
}

interface LoginState {
    member: Member | null;
    setMember: (member: Member) => void;
}

export const useLoginStore = create<LoginState>((set, get)=>({
    member : {email : "aaa@naver.com", nickname : "정다솔", role : "client"},
    setMember : (member : Member) => set({member}),
}));