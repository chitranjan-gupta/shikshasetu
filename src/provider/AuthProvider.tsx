'use client';

import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type FC,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from '@/components/ui/toast';
import { AuthContext } from '@/context';
import {
  login,
  logout,
  changePassword,
  oauth_google_redirect,
  oauth_google_callback,
  setRequestInterceptor,
  setResponseInterceptior,
} from '@/api';
import { getItem, removeItem, setItem, openTab, browserTabs } from '@/lib';
import { useUser, useToast } from '@/hooks';
import { isAuth$ } from '@/store';

import type { TokenType, SignInState } from '@/types';

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN = 'token';

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { editUser, getUser, user, removeUser } = useUser();
  const [token, setToken] = useState<TokenType | null>(null);
  const [status, setStatus] = useState<string>('idle');
  const [isloading, setIsloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleDashboard = useCallback(() => {
    if (browserTabs) {
      openTab({ url: '/src/option/index.html#/dashboard' });
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const oauth = useCallback(
    async (provider: string, register: boolean = true) => {
      try {
        console.log(provider);
        setIsloading(true);
        const res = await oauth_google_redirect(register);
        if (res.status === 200) {
          if (res.data && res.data.url) {
            window.location.href = res.data.url;
          }
        }
      } catch (e: any) {
        console.log(e?.response || 'Error in OAuth');
        setError(e?.response?.data?.message || 'Error in OAuth');
      } finally {
        setIsloading(false);
      }
    },
    []
  );
  const refresh = useCallback(
    async (newToken: TokenType | null, logout: boolean) => {
      try {
        setIsloading(true);
        if (!logout && newToken) {
          setStatus('signIn');
          setToken(newToken);
          setRequestInterceptor({ token: newToken! });
          setResponseInterceptior({ token: newToken!, refresh: refresh });
          await setItem<TokenType>(TOKEN, newToken!);
          isAuth$.set(true);
        } else {
          setStatus('signOut');
          setToken(null);
          isAuth$.set(false);
          await removeItem(TOKEN);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsloading(false);
      }
    },
    []
  );
  const oauth_success = useCallback(
    async (url: string) => {
      let auth = false;
      try {
        setIsloading(false);
        const response = await oauth_google_callback(url);
        if (response.status === 200) {
          const token = {
            access_token: response.data.access_token,
            refresh_token: response.data.access_token,
          };
          setStatus('signIn');
          setToken(token);
          setRequestInterceptor({ token });
          setResponseInterceptior({ token: token, refresh: refresh });
          editUser(response.data);
          await setItem<TokenType>(TOKEN, token);
          isAuth$.set(true);
          auth = true;
        }
      } catch (e: any) {
        console.log(e?.response || 'Error in OAuth');
        setError(e?.response?.data?.message || 'Error in OAuth');
        setIsloading(false);
      }
      return auth;
    },
    [refresh, editUser]
  );
  const signIn = useCallback(
    async (data: SignInState) => {
      try {
        setIsloading(true);
        const response = await login(data);
        if (response.status === 200) {
          const token = {
            access_token: response.data.access_token,
            refresh_token: response.data.access_token,
          };
          setStatus('signIn');
          setToken(token);
          setRequestInterceptor({ token });
          setResponseInterceptior({ token: token, refresh: refresh });
          editUser(response.data);
          await setItem<TokenType>(TOKEN, token);
          isAuth$.set(true);
        }
      } catch (e: any) {
        console.log(e?.response || 'Error in signIn');
        setError(e?.response?.data?.message || 'Error in signIn');
      } finally {
        setIsloading(false);
      }
    },
    [refresh, editUser]
  );
  const signOut = useCallback(async () => {
    try {
      setIsloading(true);
      const response = await logout();
      if (response.status === 200) {
        await removeItem(TOKEN);
        setStatus('signOut');
        setToken(null);
        const tempToken = { access_token: '', refresh_token: '' };
        setRequestInterceptor({ token: tempToken });
        setResponseInterceptior({ token: tempToken, refresh: refresh });
        isAuth$.set(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsloading(false);
    }
  }, [refresh]);

  const changepassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        setIsloading(true);
        const res = await changePassword(currentPassword, newPassword);
        if (res.status === 200) {
          toast({
            title: 'Successfully Password is Changed',
            description: new Date().toString(),
            action: (
              <ToastAction altText="navigate" onClick={handleDashboard}>
                Go to Dashboard
              </ToastAction>
            ),
          });
        }
      } catch (e: any) {
        console.log(e);
        if (e.status === 400) {
          setError(JSON.stringify(e.response.data));
        }
      } finally {
        setIsloading(false);
      }
    },
    [setIsloading, setError, handleDashboard, toast]
  );

  const hydrate = useCallback(async () => {
    try {
      setIsloading(true);
      const token = await getItem<TokenType>(TOKEN);
      if (token !== null) {
        setRequestInterceptor({ token });
        setResponseInterceptior({ token: token, refresh: refresh });
        setStatus('signIn');
        setToken(token);
        isAuth$.set(true);
      } else {
        setStatus('signOut');
        setToken(null);
        isAuth$.set(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsloading(false);
    }
  }, [refresh]);

  const handleLogout = useCallback(async () => {
    if (status === 'signIn') {
      await signOut();
      await removeUser();
    } else {
      if (browserTabs) {
        openTab({ url: 'src/option/index.html#/login' });
      } else {
        navigate('/login');
      }
    }
  }, [status, navigate, signOut, removeUser]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user && user.userId.length === 0 && token) {
      void getUser();
    }
  }, [user, getUser, token]);

  useEffect(() => {
    if (status === 'signIn') {
      toast({
        title: 'Successfully Signed',
        description: new Date().toString(),
        action: (
          <ToastAction altText="navigate" onClick={handleDashboard}>
            Go to Dashboard
          </ToastAction>
        ),
      });
    }
  }, [status, handleDashboard, toast]);
  return (
    <AuthContext.Provider
      value={{
        token,
        status,
        isloading,
        error,
        signIn,
        signOut,
        changepassword,
        refresh,
        oauth,
        oauth_success,
        hydrate,
        handleDashboard,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
