"use client";

import { ClientForm } from "@/components/client-form";
import { H1 } from "@/components/typography";

export default function NewClientPage() {
  return (
    <div className="flex h-full flex-col p-4">
      <H1>New Client</H1>
      <ClientForm />
    </div>
  );
}
