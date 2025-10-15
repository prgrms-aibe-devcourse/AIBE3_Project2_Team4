"use client";

import { TabsContent } from "@/components/ui/tabs";
import MyServiceTab from "./MyServiceTab";
import useLogin from "@/hooks/use-Login";

export default function Service() {
  const { isLoggedIn, member } = useLogin();
  const userType = member ? member.role : null;
  return (
    <>
      {userType === "freelancer" && (
        <TabsContent value="my-services">
          <MyServiceTab />
        </TabsContent>
      )}
    </>
  );
}
