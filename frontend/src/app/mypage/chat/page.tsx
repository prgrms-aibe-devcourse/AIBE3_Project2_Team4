"use client";

import { TabsContent } from "@/components/ui/tabs";
import ChatTab from "./ChatTab";

export default function Chat() {
  return (
    <TabsContent value="chat">
      <ChatTab />
    </TabsContent>
  );
}
