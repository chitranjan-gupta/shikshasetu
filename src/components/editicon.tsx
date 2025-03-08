'use client';

import { type FC, memo } from 'react';
import { Pencil, PencilOff } from 'lucide-react';

interface EditIconProps {
  state: boolean;
}

const EditIconComponent: FC<EditIconProps> = ({ state }) => {
  return (
    <>
      {state ? (
        <PencilOff
          aria-hidden="true"
          className="h-4 w-4 flex-shrink-0 text-gray-400"
        />
      ) : (
        <Pencil
          aria-hidden="true"
          className="h-4 w-4 flex-shrink-0 text-gray-400"
        />
      )}
    </>
  );
};

export const EditIcon = memo(EditIconComponent);
