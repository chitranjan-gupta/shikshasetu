import { client } from '@/api';

import type { FormSchemaType } from '@/types';

export async function getAutofill() {
  const res = await client.get(`autofill`);
  return res.data;
}

export async function setAutofill(data: (FormSchemaType & { id: string })[]) {
  const res = await client.post(`autofill`, { data: data });
  return res.data;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return await client.post(`storage/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function downloadFile(url: string) {
  return await client.get('', {
    baseURL: url,
    responseType: 'blob', // This will return the response as a Blob object
    withCredentials: true,
  });
}
