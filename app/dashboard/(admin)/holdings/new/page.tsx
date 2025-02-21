import { H1 } from "@/components/typography";
import { HoldingForm } from "@/components/Forms/holding-form";

export default function NewHoldingPage() {
  return (
    <div className="flex h-full flex-col p-4">
      <H1>New Holding</H1>
      <HoldingForm />
    </div>
  );
}
