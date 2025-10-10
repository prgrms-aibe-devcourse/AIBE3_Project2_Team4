import { useLoginStore } from "@/store/useLoginStore";
import { backendLogout, clearAccessToken } from "@/lib/api";

export default function useLogin() {
  const { member, setMember } = useLoginStore();

  const isLoggedIn = member !== null;

  const logout = async () => {
    try {
      clearAccessToken();
      await backendLogout();
    } finally {
      setMember(null);
    }
  };

  return { member, setMember, isLoggedIn, logout };
}
