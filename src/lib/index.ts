import { FormSchema } from '@/constants';
import { FormSchemaType } from '@/types';
import { z, type ZodTypeAny } from 'zod';
export * from './storage';
export * from './utils';
export * from './browser';

// Define HTML input types mapping for each field type
function getHtmlInputType(schema: ZodTypeAny, fieldName: string): string {
  // Handle optional types by extracting the inner type
  const baseSchema =
    schema instanceof z.ZodOptional ? schema._def.innerType : schema;

  if (baseSchema instanceof z.ZodString) {
    if (fieldName === 'country') {
      return 'select'; // Handle country as select dropdowns
    }
    if (fieldName === 'about' || fieldName === 'interest_about_company') {
      return 'textarea'; // Handle about and interest_about_company as textarea
    }
    if (baseSchema._def.checks.some((check) => check.kind === 'email')) {
      return 'email'; // Email input for email fields
    }
    if (baseSchema._def.checks.some((check) => check.kind === 'url')) {
      return 'url'; // URL input for URL fields
    }
    return 'text'; // Default string input
  }
  if (baseSchema instanceof z.ZodNumber) return 'number'; // Numeric input
  if (baseSchema instanceof z.ZodBoolean) return 'checkbox'; // Checkbox for booleans
  if (baseSchema instanceof z.ZodObject) return 'object'; // Object for nested objects
  if (baseSchema instanceof z.ZodArray) return 'array'; // Array for nested arrays
  if (baseSchema instanceof z.ZodEffects) {
    if (fieldName === 'last_working_day') return 'date'; // Date input for date fields
  }
  return 'text'; // Default to text if type is unknown
}
// console.log(FormSchema.shape["skills"]._def.innerType._def.type)
// console.log(FormSchema.shape["files"]._def.innerType._def.type._def.shape())
// const currentSalarySchema = FormSchema.shape["current_salary"];
// if (currentSalarySchema instanceof z.ZodOptional) {
//   // Access the inner object schema
//   const innerSchema = currentSalarySchema._def.innerType;

//   // Now you can safely access the shape of the inner schema
//   console.log(innerSchema.shape); // This will give you the shape of the `current_salary` object
// } else {
//   // If somehow it's not optional, log the shape directly
//   console.log(currentSalarySchema.shape);
// }
// Generate the FormValues array with HTML input types
export const FormValues = Object.entries(FormSchema.shape).map(
  ([key, schema]) => {
    const fieldType = getHtmlInputType(schema, key); // Map Zod types to HTML input types
    return {
      value: key,
      type: fieldType,
    };
  }
);

export const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err: any) {
    console.log(err);
    return false;
  }
};

export const camelCase = (text: string) => {
  return text.replace(text.charAt(0), text.charAt(0).toUpperCase());
};

interface ReplaceAllOccurrencesParams {
  str: string;
  search: string | RegExp;
  replace: string;
}

function replaceAllOccurrences({
  str,
  search,
  replace,
}: ReplaceAllOccurrencesParams): string {
  // Ensure the search parameter is a string or RegExp
  if (typeof search === 'string') {
    search = new RegExp(search, 'g'); // Convert search to global RegExp if it's a string
  }

  return str.replace(search, replace);
}

export function getDomain(url: string): string {
  return new URL(url).hostname;
}

export const normalizeText = (text: string) => {
  return replaceAllOccurrences({
    str: camelCase(text),
    search: '_',
    replace: ' ',
  });
};

// Function to save data to Chrome extension local storage
export function saveData(key: string, value: unknown) {
  const data: Record<string, unknown> = {};
  data[key] = value;
  chrome.storage.local.set(data, function () {
    console.log('Data saved:', key, value);
  });
}

// Enhanced function to generate a random string (with optional characters set)
export function generateRandomString(
  length: number,
  charSet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
) {
  let result = '';
  const charactersLength = charSet.length;
  for (let i = 0; i < length; i++) {
    result += charSet.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Function to generate a random email address with a customizable domain
export function generateRandomEmail() {
  const usernameLength = 10; // Length of the username part of the email
  const username = generateRandomString(usernameLength); // Generate random username
  const domains = ['example.com', 'test.com', 'random.com', 'mail.com']; // List of possible email domains
  const randomDomain = domains[Math.floor(Math.random() * domains.length)]; // Randomly select a domain
  return `${username}@${randomDomain}`;
}

// Function to generate a random strong password with uppercase, lowercase, numbers, and symbols
export function generateRandomPassword() {
  const passwordLength = 12; // Length of the password

  // Character sets for each category
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specialChars = '!@#$%^&*()_+';

  // Ensure the password contains at least one character from each category
  const password = [
    generateRandomString(1, lowercase),
    generateRandomString(1, uppercase),
    generateRandomString(1, digits),
    generateRandomString(1, specialChars),
  ].join('');

  // Fill the rest of the password with random characters
  const remainingLength = passwordLength - password.length;
  const allChars = lowercase + uppercase + digits + specialChars;
  return password + generateRandomString(remainingLength, allChars);
}

export function sanitize(t: string): string {
  return t.trim().toLowerCase();
}

export function setAllInputFields(data: any) {
  console.log('SiteFill', data);
  const site = data.sites ? data?.sites[window.location.href] : data;
  console.log('Site', site);
  if (site) {
    const inputs = document.querySelectorAll(
      'input, select, checkbox, radio, textarea'
    );
    inputs.forEach((input: any) => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        const d = site[input.name];
        if (
          typeof d !== 'undefined' &&
          sanitize(String(input.value)) === sanitize(String(d))
        ) {
          input.checked = true;
        }
      } else if (
        input.type !== 'file' ||
        input instanceof HTMLSelectElement ||
        input instanceof HTMLTextAreaElement
      ) {
        console.log('input', input.name);
        const d = site[input.name];
        console.log('d', d);
        if (typeof d !== 'undefined') {
          input.value = d;
        }
      }
    });
  }
}

export function getAllInputFields(storedData: FormSchemaType) {
  // This will get all input, textarea, and select elements
  const inputs = document.querySelectorAll('input, textarea, select');
  // console.log(inputs) // Log the values or send it back to the extension
  if (storedData) {
    inputs.forEach((field) => {
      const inputField = field as unknown as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement;
      switch (sanitize(inputField.name || '')) {
        case 'user[name]':
        case 'name':
          inputField.value = storedData.full_name ?? '';
          return;
        case 'first_name':
        case 'personal_info.first_name':
        case 'firstname':
          inputField.value = storedData.first_name ?? '';
          return;
        case 'middle_name':
        case 'middlename':
          inputField.value = storedData.middle_name ?? '';
          return;
        case 'last_name':
        case 'personal_info.last_name':
        case 'lastname':
          inputField.value = storedData.last_name ?? '';
          return;
        case 'phone_number':
        case 'phone':
        case 'personal_info.phone':
        case 'mobilephone.number':
          inputField.value = storedData.phone_number?.phone_number ?? '';
          return;
        case 'personal_info.email':
        case 'email':
          inputField.value = storedData.email ?? '';
          return;
        case '9n098h':
        case 'country':
          inputField.value = storedData.country ?? '';
          return;
        case 'address':
          inputField.value = storedData.address ?? '';
          return;
        case 'location':
        case 'standardfields.currentlocation.answer':
        case 'city':
          inputField.value = storedData.city ?? '';
          return;
        case 'state':
          inputField.value = storedData.state ?? '';
          return;
        case 'yearsofexperience':
        case 'workexperience.years':
          inputField.value = storedData.work_experience?.years ?? '';
          return;
        case 'workexperience.months':
          inputField.value = storedData.work_experience?.months ?? '';
          return;
        case 'desiredsalary':
        case 'expectedsalary.amount':
          inputField.value =
            storedData.salary_expectation?.salary?.toString() ?? '';
          return;
        case 'currentsalary.amount':
          inputField.value =
            storedData.current_salary?.salary?.toString() ?? '';
          return;
        case 'standardfields.availability.answer':
          inputField.value = storedData.available_to_join_in_days ?? '';
          return;
        // case 'usauthorized':
        //   inputField.value = storedData.us_work_authorization?.toString() ?? '';
        //   continue;
        case 'requiresponsorship':
          inputField.value =
            storedData.do_you_require_visa_sponsorship?.toString() ?? '';
          return;
        case 'usernote':
        case 'customquestionanswers[52686][answer]':
          inputField.value = storedData.interest_about_company ?? '';
          return;
        case 'urls[linkedin]':
          inputField.value = storedData.linkedin ?? '';
          return;
        case 'urls[github]':
          inputField.value = storedData.github ?? '';
          return;
        case 'urls[portfolio]':
          inputField.value = storedData.portfolio ?? '';
          return;
      }
      switch (sanitize(inputField.type || '')) {
        case 'email':
          inputField.value = storedData.email ?? '';
          return;
        case 'tel':
          inputField.value = storedData.phone_number?.phone_number ?? '';
          return;
      }
      switch (sanitize(inputField.id || '')) {
        case 'email':
          inputField.value = storedData.email ?? '';
          return;
        case 'phone':
          inputField.value = storedData.phone_number?.phone_number ?? '';
          return;
        case 'player_email':
          inputField.value = storedData.email ?? '';
          return;
        case 'player_name':
          inputField.value = storedData.first_name ?? '';
          return;
        case 'player_name_last':
          inputField.value = storedData.last_name ?? '';
          return;
        case 'female':
          if (inputField instanceof HTMLInputElement) {
            inputField.checked =
              (storedData.gender?.toLowerCase() ?? '') === 'female'
                ? true
                : false;
            return;
          }
          break;
        case 'male':
          if (inputField instanceof HTMLInputElement) {
            inputField.checked =
              (storedData.gender?.toLowerCase() ?? '') === 'male'
                ? true
                : false;
            return;
          }
          break;
      }
      switch (sanitize(inputField.autocomplete || '')) {
        case 'given-name':
          inputField.value = storedData.first_name ?? '';
          return;
        case 'family-name':
          inputField.value = storedData.last_name ?? '';
          return;
      }
      interface Custom_Field {
        search_type: string;
        selector: string;
        value: string;
      }
      const custom_fields = (storedData?.custom_fields ||
        []) as unknown as Custom_Field[];
      custom_fields.forEach((custom_field) => {
        switch (custom_field.search_type) {
          case 'name': {
            if (
              sanitize(custom_field.selector || '') ===
              sanitize(inputField.name || '')
            ) {
              inputField.value = custom_field.value;
              return;
            }
            break;
          }
          case 'id': {
            if (
              sanitize(custom_field.selector || '') ===
              sanitize(inputField.id || '')
            ) {
              inputField.value = custom_field.value;
              return;
            }
            break;
          }
          case 'class': {
            if (
              sanitize(custom_field.selector || '') ===
              sanitize(inputField.className || '')
            ) {
              inputField.value = custom_field.value;
              return;
            }
            break;
          }
          case 'autocomplete': {
            if (
              sanitize(custom_field.selector || '') ===
              sanitize(inputField.autocomplete || '')
            ) {
              inputField.value = custom_field.value;
              return;
            }
            break;
          }
        }
      });
    });
  }
}
