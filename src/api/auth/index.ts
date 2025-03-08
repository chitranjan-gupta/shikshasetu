import axios from 'axios';

import { client } from '@/api';
import { API_URL } from '@/constants';

import type { SignUpState, SignInState } from '@/types';

export async function login(data: SignInState) {
  return await axios.post(`${API_URL}/user/signin`, data, {
    withCredentials: true,
  });
}

export async function oauth_google_redirect(register: boolean = true) {
  return await axios.get(
    `${API_URL}/user/oauth-${register ? 'register' : 'login'}`,
    {
      withCredentials: true,
    }
  );
}

export async function oauth_google_callback(searchParams: string) {
  return await axios.get(`${API_URL}/user/oauth-success${searchParams}`, {
    withCredentials: true,
  });
}

export async function logout() {
  return await client.get(`user/logout`);
}

export async function register(data: SignUpState) {
  return await axios.post(`${API_URL}/user/signup`, data, {
    withCredentials: true,
  });
}

export async function me() {
  return await client.get(`user/auth`);
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  return await client.post(`user/change-password`, {
    currentPassword,
    newPassword,
  });
}
