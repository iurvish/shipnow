import React from "react";
import CustomMultiSelect from "@/components/ui/autoform/custom/multiselect";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface ProjectMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder: string;
  id: string;
  fieldKey: string;
}

const ProjectMultiSelect: React.FC<ProjectMultiSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  id,
  fieldKey,
}) => {
  return (
    <CustomMultiSelect
      inputProps={{
        value,
        onChange: (e: any) => {
          if (e?.target?.value) {
            onChange(e.target.value);
          }
        },
        name: fieldKey,
        onBlur: () => {},
        disabled: false,
        ref: () => {},
      }}
      field={{
        key: fieldKey,
        type: "string[]" as any,
        required: false,
        fieldConfig: {
          inputProps: {
            options,
            placeholder,
          },
        },
      }}
      id={id}
      label=""
      value={value}
      path={[fieldKey]}
    />
  );
};

export default ProjectMultiSelect;
