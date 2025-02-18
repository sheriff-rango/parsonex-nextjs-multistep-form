import React, { useMemo } from "react";
import { IMultiStepForm } from "./types";

const MultiStepForm: React.FC<IMultiStepForm> = (props) => {
  const { title, options, gridCols = 2 } = props;
  const totalSteps = useMemo(() => options.length || 0, [options]);

  console.log("debug gridCols", gridCols);

  return (
    <div className="mt-4 rounded-xl border bg-card pt-4 text-card-foreground shadow">
      <div className="h-full p-6 pt-0">
        <h1>MultiStepForm</h1>
      </div>
    </div>
  );
};

export default MultiStepForm;
