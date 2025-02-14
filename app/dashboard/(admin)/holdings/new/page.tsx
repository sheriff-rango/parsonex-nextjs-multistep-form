import { H1 } from "@/components/typography";
import { HoldingForm } from "@/components/holding-form";

interface NewHoldingPageProps {
  searchParams: {
    accountId?: string;
  };
}

export default function NewHoldingPage({ searchParams }: NewHoldingPageProps) {
  return (
    <div className="flex h-full flex-col p-4">
      <H1>New Holding</H1>
      <HoldingForm accountId={searchParams.accountId} />
    </div>
  );
}
