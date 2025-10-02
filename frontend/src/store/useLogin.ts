import { create } from 'zustand';

interface Member {
    email : string;
    nickname : string;
    role : string;
}

interface LoginState {
    member: Member | null;
    setMember: (member: Member) => void;
}

export const useLogin = create<LoginState>((set, get)=>({
    member : null,
    setMember : (member : Member) => set({member}),
}));