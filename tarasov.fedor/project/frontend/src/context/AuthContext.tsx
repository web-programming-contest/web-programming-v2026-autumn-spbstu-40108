import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
} from '../api/auth';
import type { User } from '../types';

const AUTH_CACHE_KEY = 'gadget-hub-auth-user';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readCachedUser(): User | null {
  try {
    const rawValue = window.localStorage.getItem(AUTH_CACHE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsed: unknown = JSON.parse(rawValue);

    if (
      parsed &&
      typeof parsed === 'object' &&
      'id' in parsed &&
      'username' in parsed &&
      typeof (parsed as User).id === 'number' &&
      typeof (parsed as User).username === 'string'
    ) {
      return parsed as User;
    }
  } catch {
    // Поврежденное значение будет удалено ниже.
  }

  window.localStorage.removeItem(AUTH_CACHE_KEY);
  return null;
}

function cacheUser(user: User): void {
  window.localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
}

function clearCachedUser(): void {
  window.localStorage.removeItem(AUTH_CACHE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(() => readCachedUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    getCurrentUserRequest()
      .then(({ user: currentUser }) => {
        if (!isActive) {
          return;
        }

        setUser(currentUser);
        cacheUser(currentUser);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setUser(null);
        clearCachedUser();
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<User> => {
      const { user: authenticatedUser } = await loginRequest(username, password);
      setUser(authenticatedUser);
      cacheUser(authenticatedUser);
      return authenticatedUser;
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      clearCachedUser();
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [isLoading, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Хук useAuth должен использоваться внутри AuthProvider');
  }

  return context;
}
