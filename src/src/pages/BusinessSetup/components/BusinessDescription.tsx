import React from "react";
import Input from "../../../components/Input";

interface Props {
  bio: string;
  process: string;
  setBio: (val: string) => void;
  setProcess: (val: string) => void;
  errors?: Record<string, string>; // errors is an object, optional
  clearError: (field: string) => void;
}

const BusinessDescriptionSection: React.FC<Props> = ({
  bio,
  process,
  setBio,
  setProcess,
  errors = {},
  clearError,
}) => {
  const handleBioChange = (val: string) => {
    setBio(val);
    if (errors.bio) clearError("bio");
  };

  const handleProcessChange = (val: string) => {
    setProcess(val);
    if (errors.process) clearError("process");
  };
  return (
    <>
      <Input
        label="About / Business Description"
        placeholder="About / Business Description"
        multiline
        minRows={3}
        fullWidth
        value={bio}
        onChange={(e) => handleBioChange(e.target.value)}
        error={!!errors.bio}
        helperText={errors.bio}
      />
      <Input
        label="Process"
        placeholder="Process"
        multiline
        minRows={3}
        fullWidth
        sx={{ mt: 2 }}
        value={process}
        onChange={(e) => handleProcessChange(e.target.value)}
        error={!!errors.process}
        helperText={errors.process}
      />
    </>
  );
};

export default BusinessDescriptionSection;
