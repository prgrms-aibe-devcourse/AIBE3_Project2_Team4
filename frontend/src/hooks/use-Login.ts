import {useLoginStore} from "@/store/useLoginStore";

export default function useLogin() {
    const { member, setMember } = useLoginStore();

    const isLoggedIn = member !== null;

    return {member, setMember, isLoggedIn}
}