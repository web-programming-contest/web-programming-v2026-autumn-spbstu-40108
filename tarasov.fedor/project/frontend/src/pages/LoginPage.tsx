import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PageLoader } from '../components/ui/PageLoader';
import { TextField } from '../components/ui/TextField';
import { useAuth } from '../context/AuthContext';

const REQUIRED_FIELD_MESSAGE = 'Заполните обязательное поле';
const LOGIN_ERROR_MESSAGE =
  'такого пользователя нет, возможно неправильный логин или пароль проверьте данные';
const NETWORK_ERROR_MESSAGE =
  'Не удалось войти. Проверьте подключение к серверу и попробуйте снова.';

interface LoginErrors {
  username?: string;
  password?: string;
}

export function LoginPage(): JSX.Element {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <PageLoader />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};

    if (!username.trim()) {
      nextErrors.username = REQUIRED_FIELD_MESSAGE;
    }

    if (!password) {
      nextErrors.password = REQUIRED_FIELD_MESSAGE;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
      navigate('/', { replace: true });
    } catch (error: unknown) {
      setServerError(
        error instanceof ApiError && error.status === 401
          ? LOGIN_ERROR_MESSAGE
          : NETWORK_ERROR_MESSAGE,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative flex-1 overflow-hidden bg-[#C7D9FF] bg-[url('/assets/auth/login-bg.png')] bg-cover bg-center py-16">

      <div className="relative mx-auto w-full max-w-[382px]">
        <div className="rounded-2xl bg-white p-12 shadow-card">
          <h1 className="text-center text-[32px] font-bold leading-tight text-ink">
            Добро пожаловать!
          </h1>

          <form
            noValidate
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >
            <TextField
              label="Логин"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              placeholder="Введите логин"
              value={username}
              error={errors.username}
              onChange={(event) => {
                setUsername(event.target.value);
                if (errors.username) {
                  setErrors((current) => ({
                    ...current,
                    username: undefined,
                  }));
                }
              }}
            />

            <TextField
              label="Пароль"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Введите пароль"
              value={password}
              error={errors.password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) {
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));
                }
              }}
            />

            <Button
              type="submit"
              size="lg"
              className="w-[140px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Входим...' : 'Войти'}
            </Button>
          </form>

        </div>
      </div>

      <Modal
        open={serverError !== null}
        title="Ошибка входа"
        onClose={() => setServerError(null)}
        footer={
          <Button onClick={() => setServerError(null)}>Ок</Button>
        }
      >
        <p>{serverError}</p>
      </Modal>
    </section>
  );
}
