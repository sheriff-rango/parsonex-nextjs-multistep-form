import { H1 } from "@/components/typography";
import { RepForm } from "@/components/Forms/rep-form";

export default async function NewRepPage() {
  return (
    <>
      <H1>Create Rep</H1>
      <RepForm />
    </>
  );
}
