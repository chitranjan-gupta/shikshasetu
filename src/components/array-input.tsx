'use client';

import { useState, Fragment, type FC } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Paperclip, Trash2 } from 'lucide-react';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { EditIcon } from './editicon';
import { ObjectInput } from './object-input';

import { normalizeText } from '@/lib';
import { FormSchema } from '@/constants';
import { useS3, useAccount } from '@/hooks';

import type { FormSchemaType, FormValuesType } from '@/types';

interface ArrayInputProps {
  form: UseFormReturn<FormSchemaType>;
  property: FormValuesType;
  description: string;
}

const getDefaultValue = (
  type:
    | z.ZodAny
    | z.ZodNumber
    | z.ZodString
    | z.ZodBoolean
    | z.ZodEffects<z.ZodString, string, string>
) => {
  if (type instanceof z.ZodArray) {
    return [];
  } else if (type instanceof z.ZodObject) {
    return {};
  } else if (type instanceof z.ZodString) {
    return '';
  } else if (type instanceof z.ZodNumber) {
    return 0;
  } else if (type instanceof z.ZodBoolean) {
    return false;
  }
  return '';
};

const createDownloadLink = (file: File) => {
  const a = document.querySelector<HTMLAnchorElement>('#download-url');
  if (a && file) {
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// const ListFile = ({ file }: { file: File }) => {
//   return (
//     <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
//       <div className="flex w-0 flex-1 items-center">
//         <Paperclip
//           aria-hidden="true"
//           className="h-5 w-5 flex-shrink-0 text-gray-400"
//         />
//         <div className="ml-4 flex min-w-0 flex-1 gap-2">
//           <span className="truncate font-medium">{file.name}</span>
//           <span className="flex-shrink-0 text-gray-400">{file.size} bytes</span>
//         </div>
//       </div>
//       <div className="ml-4 flex-shrink-0">
//         <button
//           className="font-medium text-indigo-600 hover:text-indigo-500"
//           onClick={() => createDownloadLink(file)}
//         >
//           Download
//         </button>
//       </div>
//     </li>
//   );
// };

interface ListProps {
  data: [string, string];
}

const List: FC<ListProps> = ({ data }) => {
  return (
    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
      <div className="flex w-0 flex-1 items-center">
        <div className="ml-4 flex min-w-0 flex-1 gap-2">
          <span className="truncate font-medium">{data[0]}</span>
          <span className="truncate font-medium">{data[1]}</span>
        </div>
      </div>
    </li>
  );
};

interface DocumentProps {
  index: number;
  currentDocument: { document_type: string; url: string };
}

const regex = /https?:\/\//;

const Document: FC<DocumentProps> = ({ index, currentDocument }) => {
  // const file = s3$.getBucket(url.replace('indexeddb://', ''));
  const { account } = useAccount();
  const { buckets, fetchBucket } = useS3();
  const key = `documents.${index}.url`;
  const file = buckets.get(key)?.file;
  console.log(file);
  if (!file) {
    if (
      currentDocument &&
      currentDocument.url &&
      currentDocument.url.match(regex) &&
      currentDocument.url.length > 4
    ) {
      console.log('Fetching...doc');
      fetchBucket(key, currentDocument.url, account);
    }
  }
  return (
    <>
      {file ? (
        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
          <div className="flex w-0 flex-1 items-center">
            <Paperclip
              aria-hidden="true"
              className="h-5 w-5 flex-shrink-0 text-gray-400"
            />
            <div className="ml-4 flex min-w-0 flex-1 gap-2">
              <span className="truncate font-medium">{`${currentDocument.document_type} - ${file.name}`}</span>
              <span className="flex-shrink-0 text-gray-400">
                {file.size} bytes
              </span>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => createDownloadLink(file)}
            >
              Download
            </button>
          </div>
        </li>
      ) : (
        <></>
      )}
    </>
  );
};

export const ArrayInput: FC<ArrayInputProps> = ({
  form,
  property,
  description,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { fields, append, remove } = useFieldArray<FormSchemaType>({
    control: form.control,
    name: property.value as never,
  });
  const arrayValues = form.getValues(property.value as keyof FormSchemaType);
  const type =
    FormSchema.shape[property.value as keyof FormSchemaType]._def.innerType;
  const propertyDetail =
    type instanceof z.ZodArray
      ? type._def.type instanceof z.ZodObject
        ? type._def.type.shape
        : ''
      : '';
  const fieldsDetail =
    typeof propertyDetail !== 'string'
      ? Object.fromEntries(
          Object.entries(propertyDetail).map((value) => [
            value[0],
            getDefaultValue(value[1]),
          ])
        )
      : {};
  const propertyType =
    type instanceof z.ZodArray
      ? type._def.type instanceof z.ZodObject
        ? 'object'
        : 'string'
      : 'string';
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm/6 font-medium text-gray-900 flex sm:flex-row sm:flex-wrap flex-row">
        {normalizeText(String(property.value || ''))}
      </dt>
      <div className="p-2 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-wrap justify-start items-center gap-x-5">
        {!isEditing ? (
          <>
            {Array.isArray(arrayValues) && arrayValues.length > 0 ? (
              <ul
                role="list"
                className="w-full divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                {(arrayValues as string[]).map((item, index) =>
                  propertyType === 'object' ? (
                    <Fragment key={index}>
                      {typeof item === 'object' &&
                      (item as { document_type: string }).document_type ? (
                        <Document index={index} currentDocument={item} />
                      ) : (
                        <>
                          <span>{index}</span>
                          {Object.entries(item).map((val, index) => (
                            <List key={index} data={val} />
                          ))}
                        </>
                      )}
                    </Fragment>
                  ) : (
                    <li
                      key={item}
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">{item}</span>
                        </div>
                      </div>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2">
            {fields.map((item, index) => (
              <FormField
                control={form.control}
                name={`${property.value}.${index}` as keyof FormSchemaType}
                key={item.id}
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-row">
                        {propertyType === 'object' ? (
                          <ObjectInput
                            form={form}
                            property={{
                              value: `${property.value}.${index}`,
                              type: 'object',
                            }}
                            description={description}
                          />
                        ) : (
                          <Input
                            {...form.register(
                              `${property.value}.${index}` as keyof FormSchemaType
                            )}
                          />
                        )}
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              onClick={() =>
                propertyType === 'object'
                  ? append(fieldsDetail as any)
                  : append('' as any)
              }
            >
              Add Item
            </Button>
          </div>
        )}
        <a id="download-url" className="sr-only"></a>
        <Button onClick={() => setIsEditing((prev) => !prev)} type="button">
          <EditIcon state={isEditing} />
        </Button>
      </div>
    </div>
  );
};
