"use client";

import { TabsContent } from "@/components/ui/tabs";
import PaymentTab from "./PaymentTab";
import useLogin from "@/hooks/use-Login";

export default function Payment() {
  const { isLoggedIn, member } = useLogin();
  const userType = member ? member.role : null;

  return (
    <>
      {userType == "client" && (
        <TabsContent value="payments">
          <PaymentTab isLoggedIn={isLoggedIn} />
        </TabsContent>
      )}
    </>
  );
}
