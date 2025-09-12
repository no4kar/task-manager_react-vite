import React from 'react';

export const TodoImageUpload
  = React.memo(FuncComponent);

function FuncComponent({
  onImageSelect,
}: {
  onImageSelect: (file: File) => void;
}) {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      className={`block w-full text-sm text-gray-500 
        file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 
        file:text-sm file:font-semibold file:bg-blue-50 
        file:text-blue-700 hover:file:bg-blue-100`}
      onChange={handleFileChange}
    />
  );
}
