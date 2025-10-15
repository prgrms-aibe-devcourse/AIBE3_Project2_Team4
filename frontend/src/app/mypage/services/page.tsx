"use client";

import { TabsContent } from "@/components/ui/tabs";
import ServiceTab from "./ServiceTab";

export default function ActiveService() {
  return (
    <TabsContent value="services">
      <ServiceTab />
    </TabsContent>
  );
}
