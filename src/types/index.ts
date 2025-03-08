import type { ChangeEvent, DragEvent } from 'react';
import { z } from 'zod';
import type { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/constants';
import { FormValues } from '@/lib';

export type FormSchemaType = z.infer<typeof FormSchema>;

// FormValuesType inferred from the generated FormValues
export type FormValuesType = (typeof FormValues)[number]; // Inferred as { value: "first_name", type: "string" }

export interface Pickup {
  id: string;
  field_type: string;
  search_type: string;
  selector: string;
  attribute_name: string;
  value: string;
}

export interface MailDisplayProps {
  mail: Mail | null;
  handleClick?: () => void;
}

export interface MailListProps {
  items: Mail[];
  handleClick?: (item: Mail) => void;
}

export interface MailProps {
  accounts: Account[];
  mails: Mail[];
  domains: Domain[];
  sendCommand?: (action: string, data: any) => void;
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export interface Domain {
  createdAt: string;
  domain: string;
  id: string;
  isActive: boolean;
  isPrivate: boolean;
  updatedAt: string;
}

export interface Account {
  id: string;
  address: string;
  password: string;
  quota: number;
  used: number;
  isDisabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  token: string;
}

interface Address {
  address: string;
  name: string;
}

export interface Mail {
  id: string;
  msgid: string;
  from: Address;
  to: Address[];
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
}

interface Cloud {
  name: string;
  extension: string;
  filename: string;
  url: string;
}

export interface Bucket {
  name: string;
  value: string;
  file: File;
  cloud?: Cloud;
}

export type Buckets = Map<string, Bucket>;

export interface ImageInputProps {
  handleClick: () => void;
  handleDownload: () => void;
  handleUpload: (
    event: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>
  ) => void;
  url: string;
  setUrl: (url: string) => void;
  rawData: string;
  form: UseFormReturn<FormSchemaType>;
  property: FormValuesType;
  description: string;
}

export interface TokenType {
  access_token: string;
  refresh_token: string;
}

export interface SignInState {
  email: string;
  password: string;
}

export interface SignUpState {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Message {
  id: string;
  content: string;
  role: string;
}

export type Data = [
  string,
  (
    | string
    | number
    | boolean
    | { currency: string; salary: number; salary_period: string }
    | { country_code: string; phone_number: string }
    | string[]
    | { currency: string; salary: number; salary_period: string }
    | {
        [key: string]:
          | string
          | number
          | boolean
          | { currency: string; salary: number; salary_period: string }
          | { country_code: string; phone_number: string }
          | string[];
      }
  ),
];
