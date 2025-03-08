import axios from 'axios';

import { temp_mail_api_url } from '@/constants';

export async function getDomains() {
  const response = await axios.get(`${temp_mail_api_url}/domains?page=1`);
  return response;
}

export async function getDomain(id: string) {
  const response = await axios.get(`${temp_mail_api_url}/domains/${id}`);
  return response;
}

interface Account {
  address: string;
  password: string;
}

export async function addAccount(account: Account) {
  const response = await axios.post(`${temp_mail_api_url}/accounts`, account);
  return response;
}

export async function getToken(account: Account) {
  const response = await axios.post(`${temp_mail_api_url}/token`, account);
  return response;
}

export async function getAccount(id: string, BEARER_TOKEN: string) {
  const response = await axios.get(`${temp_mail_api_url}/accounts/${id}`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response;
}

export async function getMe(BEARER_TOKEN: string) {
  const response = await axios.get(`${temp_mail_api_url}/me`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response;
}

export async function delAccount(id: string, BEARER_TOKEN: string) {
  const response = await axios.delete(`${temp_mail_api_url}/accounts/${id}`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response;
}

export async function getMessages(BEARER_TOKEN: string) {
  const response = await axios.get(`${temp_mail_api_url}/messages`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response;
}

export async function getMessage(id: string, BEARER_TOKEN: string) {
  const response = await axios.get(`${temp_mail_api_url}/messages/${id}`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response;
}

export async function patchMessage(id: string, BEARER_TOKEN: string) {
  const response = await axios.patch(`${temp_mail_api_url}/messages/${id}`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response;
}

export async function delMessage(id: string, BEARER_TOKEN: string) {
  const response = await axios.delete(`${temp_mail_api_url}/messages/${id}`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });
  return response;
}
