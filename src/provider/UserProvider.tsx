'use client';

import {
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type FC,
} from 'react';
import { observer } from '@legendapp/state/react';
import { autofills$ } from '@/store';
import { defaultUser, UserContext } from '@/context';
import { register, me } from '@/api';
import { getItem, removeItem, setItem } from '@/lib';

import type { User, SignUpState, FormSchemaType } from '@/types';

interface UserProviderProps {
  children: ReactNode;
}

const USER = 'user';

const UserProviderComponent: FC<UserProviderProps> = ({ children }) => {
  const [user, editUser] = useState<User>(defaultUser);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('idle');
  const [error, setError] = useState<string | null>(null);
  const profiles = autofills$.get().autofills;
  const setProfile = useCallback((values: FormSchemaType & { id?: string }) => {
    if (values?.id) {
      autofills$.editAutofill({ ...values, id: values.id! });
    } else {
      autofills$.addAutofill(values);
    }
  }, []);
  const setProfiles = useCallback(
    (values: (FormSchemaType & { id?: string })[]) => {
      autofills$.setAutofill(values);
    },
    []
  );
  const clearProfile = useCallback((key: number) => {
    autofills$.autofills[key].delete();
  }, []);
  const setUser = useCallback(async (data: SignUpState) => {
    let auth = false;
    try {
      setIsloading(true);
      setStatus('pending');
      const response = await register(data);
      if (response.status === 200) {
        if (response.data && response.data.userId) {
          auth = true;
        }
      }
    } catch (e: any) {
      console.log(e?.response || 'Error in Register');
      setError(e?.response?.data?.message || 'Error in Register');
      setIsloading(false);
      setStatus('idle');
    }
    return auth;
  }, []);
  const getUser = useCallback(async () => {
    try {
      setIsloading(true);
      setStatus('pending');
      const response = await me();
      if (response.status === 200) {
        editUser(response.data);
        await setItem<User>(USER, response.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsloading(false);
      setStatus('idle');
    }
  }, []);
  const removeUser = useCallback(async () => {
    try {
      setIsloading(true);
      setStatus('pending');
      editUser(defaultUser);
      await removeItem(USER);
    } catch (e) {
      console.log(e);
    } finally {
      setIsloading(false);
      setStatus('idle');
    }
  }, []);
  const hydrate = useCallback(async () => {
    try {
      setIsloading(true);
      setStatus('pending');
      const savedUser = await getItem<User>(USER);
      if (savedUser !== null) {
        editUser(savedUser);
      } else {
        editUser(defaultUser);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsloading(false);
      setStatus('idle');
    }
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <UserContext.Provider
      value={{
        isloading,
        status,
        error,
        user,
        profiles,
        setProfiles,
        setProfile,
        clearProfile,
        editUser,
        setUser,
        getUser,
        removeUser,
        hydrate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserProvider = observer(UserProviderComponent);
