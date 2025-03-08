'use client';

import { useEffect, type FC } from 'react';
import { Images, CircleUserRound } from 'lucide-react';

import { normalizeText } from '@/lib';

import type { ImageInputProps, FormSchemaType } from '@/types';

export const Photo: FC<ImageInputProps> = ({
  handleClick,
  handleDownload,
  handleUpload,
  url,
  setUrl,
  rawData,
  form,
  property,
  description,
}) => {
  const inputValue = String(
    form.getValues(property.value as keyof FormSchemaType)
  );
  useEffect(() => {
    if (
      inputValue &&
      inputValue.length > 0 &&
      url.length === 0 &&
      inputValue !== 'undefined'
    ) {
      setUrl(inputValue);
    } else {
      if (url !== 'undefined' && url) {
        form.setValue(property.value as keyof FormSchemaType, url, {
          shouldValidate: true,
        });
      }
    }
  }, [inputValue, url, setUrl, form, property.value]);
  return (
    <div className="col-span-full">
      <span
        className="block text-sm/6 font-medium text-gray-900"
        onClick={handleClick}
      >
        {normalizeText(String(property.value))}
      </span>
      <div
        className={`my-3 flex ${property.value === 'photo' ? 'items-center gap-x-3' : 'justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'}`}
        onDragOver={(event) => {
          event.stopPropagation();
          event.preventDefault();
        }}
        onDrop={handleUpload}
        onContextMenu={handleDownload}
      >
        {rawData ? (
          <img
            onLoad={() => {
              URL.revokeObjectURL(rawData);
            }}
            className={`${property.value === 'photo' ? 'h-12 w-12 rounded-full border' : 'w-full h-full'} object-contain`}
            src={rawData}
          />
        ) : (
          <>
            {property.value === 'photo' ? (
              <CircleUserRound
                aria-hidden="true"
                className="h-12 w-12 text-gray-300"
              />
            ) : (
              <div className="text-center">
                <Images
                  aria-hidden="true"
                  className="mx-auto h-12 w-12 text-gray-300"
                />
                <div className="mt-4 flex text-sm/6 text-gray-600">
                  <p
                    onClick={handleClick}
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                  </p>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs/5 text-gray-600">
                  PNG, JPG, GIF up to 10MB and to Download uploaded image right
                  click
                  {description}
                </p>
              </div>
            )}
          </>
        )}
        {property.value === 'photo' ? (
          <button
            type="button"
            onClick={handleClick}
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Change
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
