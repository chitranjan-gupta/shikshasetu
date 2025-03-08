import { z } from 'zod';

// const FileSchema = z.object({
//   documentType: z.string(),
//   file: z
//     .instanceof(FileList)
//     .refine(
//       (file) => file[0].size < 5 * 1024 * 1024,
//       'File size should be less than 5MB'
//     )
//     .refine(
//       (file) =>
//         file[0].type === 'application/pdf' ||
//         file[0].type === 'image/jpeg' ||
//         file[0].type === 'image/png',
//       'File type should be pdf, jpeg or png'
//     ),
// });

const ExperienceSchema = z.object({
  company_name: z.string(),
  job_title: z.string(),
  currently_working_here: z.boolean(),
  date_of_joining: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  date_of_relieving: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  location: z.string(),
});

const EducationSchema = z.object({
  course: z.string(),
  branch_specialization: z.string(),
  currently_studying_here: z.boolean(),
  start_of_course: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  end_of_course: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  university_college: z.string(),
  location: z.string(),
});

// const DocumentSchema = z.object({
//   document_type: z.string(),
//   url: z.string(),
// });

const CustomFieldSchema = z.object({
  id: z.string(),
  field_type: z.string(),
  search_type: z.string(),
  selector: z.string(),
  attribute_name: z.string(),
  value: z.string(),
});

// Define the form schema
export const FormSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: 'First Name must be at least 2 characters.' })
    .optional(),
  middle_name: z
    .string()
    .min(2, { message: 'Middle Name must be at least 2 characters.' })
    .optional(),
  last_name: z
    .string()
    .min(2, { message: 'Last Name must be at least 2 characters.' })
    .optional(),
  full_name: z
    .string()
    .min(2, { message: 'Full Name must be at least 2 characters.' })
    .optional(),
  age: z
    .number()
    .int()
    .positive()
    .max(120, { message: 'Age must be between 1 and 120.' })
    .optional(),
  gender: z
    .string()
    .min(2, { message: 'Gender must be at least 2 characters.' })
    .optional(),
  ethnicity: z
    .string()
    .min(2, { message: 'Ethnicity must be at least 2 characters.' })
    .optional(),
  community: z
    .string()
    .min(2, { message: 'Community must be at least 2 characters.' })
    .optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional(),
  salary_expectation: z
    .object({
      currency: z
        .string()
        .min(2, { message: 'Currency must be at least 2 characters.' }),
      salary: z
        .number()
        .positive()
        .int({ message: 'Salary must be a valid number.' }),
      salary_period: z
        .string()
        .min(2, { message: 'Salary period must be at least 2 characters.' }),
    })
    .optional(),
  about: z
    .string()
    .min(2, { message: 'About must be at least 2 characters.' })
    .optional(),
  phone_number: z
    .object({
      country_code: z
        .string()
        .min(1, { message: 'Country code must be at least 1 character.' }),
      phone_number: z
        .string()
        .min(6, { message: 'Phone number must be at least 6 characters.' }),
    })
    .optional(),
  address: z
    .string()
    .min(2, { message: 'Address must be at least 2 characters.' })
    .optional(),
  city: z
    .string()
    .min(2, { message: 'City must be at least 2 characters.' })
    .optional(),
  state: z
    .string()
    .min(2, { message: 'State must be at least 2 characters.' })
    .optional(),
  country: z
    .string()
    .min(2, { message: 'Country must be at least 2 characters.' })
    .optional(),
  zip_code: z
    .string()
    .min(2, { message: 'Zip code must be at least 2 characters.' })
    .optional(),
  skills: z
    .array(z.string().min(1, { message: 'Skill must be a non-empty string.' }))
    .optional(),
  interest_about_company: z
    .string()
    .min(2, {
      message: 'Interest about company must be at least 2 characters.',
    })
    .optional(),
  current_salary: z
    .object({
      currency: z
        .string()
        .min(2, { message: 'Currency must be at least 2 characters.' }),
      salary: z
        .number()
        .positive()
        .int({ message: 'Salary must be a valid number.' }),
      salary_period: z
        .string()
        .min(2, { message: 'Salary period must be at least 2 characters.' }),
    })
    .optional(),
  available_to_join_in_days: z
    .string()
    .regex(/^\d+$/, {
      message: 'Available to join in days must be a valid number.',
    })
    .optional(),
  open_for_relocation: z.boolean().optional(),
  open_for_remote: z.boolean().optional(),
  work_experience: z
    .object({
      years: z
        .string()
        .regex(/^\d+$/, { message: 'Years must be a valid number.' }),
      months: z
        .string()
        .regex(/^\d+$/, { message: 'Months must be a valid number.' }),
    })
    .optional(),
  last_working_day: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
  country_work_authorization: z.string().optional(),
  do_you_require_visa_sponsorship: z.boolean().optional(),
  education_details: z.array(EducationSchema).optional(),
  experience_details: z.array(ExperienceSchema).optional(),
  // attachments: z.array(FileSchema).optional(),
  linkedin: z
    .string()
    .url()
    .min(2, { message: 'LinkedIn URL must be valid.' })
    .optional(),
  github: z
    .string()
    .url()
    .min(2, { message: 'GitHub URL must be valid.' })
    .optional(),
  portfolio: z
    .string()
    .url()
    .min(2, { message: 'Portfolio URL must be valid.' })
    .optional(),
  twitter: z
    .string()
    .url()
    .min(2, { message: 'Twitter URL must be valid.' })
    .optional(),
  facebook: z
    .string()
    .url()
    .min(2, { message: 'Facebook URL must be valid.' })
    .optional(),
  instagram: z
    .string()
    .url()
    .min(2, { message: 'Instagram URL must be valid.' })
    .optional(),
  // photo: z.string().optional(),
  // cover_photo: z.string().optional(),
  // documents: z.array(DocumentSchema).optional(),
  custom_fields: z.array(CustomFieldSchema).optional(),
});

export const currencies = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'INR', label: 'INR' },
  { value: 'JPY', label: 'JPY' },
  { value: 'CNY', label: 'CNY' },
  { value: 'KRW', label: 'KRW' },
  { value: 'SGD', label: 'SGD' },
  { value: 'MYR', label: 'MYR' },
  { value: 'THB', label: 'THB' },
  { value: 'IDR', label: 'IDR' },
  { value: 'VND', label: 'VND' },
  { value: 'PHP', label: 'PHP' },
  { value: 'HKD', label: 'HKD' },
  { value: 'TWD', label: 'TWD' },
  { value: 'PKR', label: 'PKR' },
  { value: 'BDT', label: 'BDT' },
  { value: 'LKR', label: 'LKR' },
];

export const salary_periods = [
  { value: 'per_hour', label: 'per hour' },
  { value: 'per_day', label: 'per day' },
  { value: 'per_week', label: 'per week' },
  { value: 'per_month', label: 'per month' },
  { value: 'per_year', label: 'per year' },
];

export const countries = [
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Japan', label: 'Japan' },
  { value: 'China', label: 'China' },
  { value: 'South Korea', label: 'South Korea' },
];

export const states = [
  { value: 'California', label: 'California' },
  { value: 'Texas', label: 'Texas' },
  { value: 'New York', label: 'New York' },
  { value: 'Florida', label: 'Florida' },
  { value: 'Illinois', label: 'Illinois' },
  { value: 'Pennsylvania', label: 'Pennsylvania' },
  { value: 'Ohio', label: 'Ohio' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'North Carolina', label: 'North Carolina' },
  { value: 'Michigan', label: 'Michigan' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Punjab', label: 'Punjab' },
];

export const job_types = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'internship', label: 'Internship' },
  { value: 'volunteer', label: 'Volunteer' },
];

export const experience_levels = [
  { value: 'entry_level', label: 'Entry Level' },
  { value: 'mid_level', label: 'Mid Level' },
  { value: 'senior_level', label: 'Senior Level' },
  { value: 'executive_level', label: 'Executive Level' },
];

export const years_of_experience = [
  { value: '0-1', label: '0-1' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10+', label: '10+' },
];

export const countries_codes = [
  { value: '+91', label: '+91' },
  { value: '+1', label: '+1' },
];

export const tempState = {
  first_name: 'Bablu',
  middle_name: 'Kumar',
  last_name: 'Yadav',
  full_name: 'Bablu Kumar Yadav',
  email: 'bablukumardbs@gmail.com',
  salary_expectation: {
    currency: 'INR',
    salary: 120000,
    salary_period: 'per_month',
  },
  current_salary: {
    currency: 'INR',
    salary: 120000,
    salary_period: 'per_month',
  },
  age: 25,
  gender: 'male',
  ethnicity: 'Indian',
  community: 'General',
  phone_number: {
    country_code: '+91',
    phone_number: '1234567890',
  },
  about: 'I am chill and cool.',
  country: 'India',
  address: 'Bihar',
  city: 'Patna',
  state: 'Bihar',
  zip_code: '800002',
  interest_about_company: 'I am interested in your company.',
  open_for_remote: true,
  open_for_relocation: true,
  work_experience: {
    years: '2',
    months: '6',
  },
  us_work_authorization: true,
  do_you_require_visa_sponsorship: true,
  linkedin: 'https://www.linkedin.com/',
  github: 'https://www.linkedin.com/',
  portfolio: 'https://www.linkedin.com/',
  twitter: 'https://www.linkedin.com/',
  facebook: 'https://www.linkedin.com/',
  instagram: 'https://www.linkedin.com/',
  last_working_day: '2024-12-31', // Example date
  skills: ['Mechanical Engineering', 'Design', 'CAD'], // Example skills array,
  available_to_join_in_days: '30',
};

export const temp_mail_api_url = import.meta.env.VITE_TEMP_MAIL_API_URL;
export const API_URL = import.meta.env.VITE_API_URL;
