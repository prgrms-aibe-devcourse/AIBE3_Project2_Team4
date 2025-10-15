"use client";

import { TabsContent } from "@/components/ui/tabs";
import PaymentTab from "./PaymentTab";

export default function Payment() {
  return (
    <TabsContent value="payments">
      <PaymentTab />
    </TabsContent>
  );
}
