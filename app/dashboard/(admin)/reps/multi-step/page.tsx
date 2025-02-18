import { H1 } from "@/components/typography";
import { RepForm } from "@/components/rep-form";
import MultiStepForm, { TFieldItem } from "@/components/MultiStepForm";

export default async function MultiStep() {
  return (
    <MultiStepForm
      options={[
        {
          title: "Step 1",
          fields: [
            {
              name: "nameFirst",
              label: "First Name",
              type: TFieldItem.TEXT,
              required: true,
            },
            {
              name: "nameMiddle",
              label: "Middle Name",
              type: TFieldItem.TEXT,
            },
          ],
        },
      ]}
    />
  );
}
