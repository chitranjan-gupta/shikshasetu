'use client';

import { BooleanInput } from './boolean-input';
import { EmailInput } from './email-input';
import { NumberInput } from './number-input';
import { TextInput } from './text-input';
import { TextAreaInput } from './textarea-input';
import { UrlInput } from './url-input';
import { FullnameInput } from './full-name-input';
import { SelectInput } from './select-input';
import { TelInput } from './tel-input';
import { ObjectInput } from './object-input';
import { DateInput } from './date-input';
import { ArrayInput } from './array-input';
import type { UseFormReturn } from 'react-hook-form';
import { FileInput } from './file-input';
import { DocumentInput } from './document-input';
import { Photo } from './image-input';
import { withHiddenInput } from './hidden-input';

import {
  currencies,
  countries,
  countries_codes,
  salary_periods,
} from '@/constants';

import type { FormValuesType, ImageInputProps } from '@/types';

const ImageInput = withHiddenInput<ImageInputProps>(Photo);

// Render function for form inputs
export const renderInput = (form: UseFormReturn, field: FormValuesType) => {
  switch (field.type) {
    case 'text':
      return field.value.includes('photo') ? (
        // @ts-expect-error Required input to work
        <ImageInput form={form} property={field} description="" />
      ) : (
        <>
          {field.value === 'full_name' ? (
            <FullnameInput form={form} property={field} description="" />
          ) : (
            <TextInput form={form} property={field} description="" />
          )}
        </>
      );
    case 'number':
      return <NumberInput form={form} property={field} description="" />;
    case 'email':
      return <EmailInput form={form} property={field} description="" />;
    case 'url':
      return <UrlInput form={form} property={field} description="" />;
    case 'checkbox':
      return <BooleanInput form={form} property={field} description="" />;
    case 'select':
      // Handle the select dropdowns for currency and country
      if (field.value.includes('currency')) {
        return (
          <SelectInput
            form={form}
            property={field}
            description=""
            options={currencies}
          />
        );
      }
      if (field.value.includes('country')) {
        return (
          <SelectInput
            form={form}
            property={field}
            description=""
            options={countries}
          />
        );
      }
      if (field.value.includes('country_code')) {
        // Handle country_code as select dropdown
        return (
          <SelectInput
            form={form}
            property={field}
            description=""
            options={countries_codes}
          />
        );
      }
      if (field.value.includes('salary_period')) {
        // Handle salary_period as select dropdown
        return (
          <SelectInput
            form={form}
            property={field}
            description=""
            options={salary_periods}
          />
        );
      }
      return <></>; // Default to empty if no matching field type

    case 'textarea':
      // Handle the textarea for about and interest_about_company
      return <TextAreaInput form={form} property={field} description="" />;

    case 'tel':
      return <TelInput form={form} property={field} description="" />; // Handle phone number input

    case 'object':
      return <ObjectInput form={form} property={field} description="" />; // Handle nested objects

    case 'date':
      return <DateInput form={form} property={field} description="" />; // Handle date input

    case 'array':
      return <ArrayInput form={form} property={field} description="" />; // Handle array input

    case 'file':
      return <FileInput form={form} property={field} description="" />; // Handle file input

    case 'document':
      return <DocumentInput form={form} property={field} description="" />;

    default:
      return <></>;
  }
};
