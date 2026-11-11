export type AuthUser = { id: string; email: string; name: string };
export type LoginCredentials = { email: string; password: string };
export type RegisterCredentials = LoginCredentials & { name: string };
export type RegistrationResult = { user: AuthUser | null; confirmationRequired: boolean };

export interface AuthGateway {
  restore(): Promise<AuthUser | null>;
  signIn(credentials: LoginCredentials): Promise<AuthUser>;
  signUp(credentials: RegisterCredentials): Promise<RegistrationResult>;
  signOut(): Promise<void>;
  resendConfirmation(email: string): Promise<void>;
  subscribe(listener: (user: AuthUser | null) => void): () => void;
  startAutoRefresh(): void;
  stopAutoRefresh(): void;
}

export class AuthFailure extends Error {}

export function authMessage(error: unknown): string {
  return error instanceof AuthFailure ? error.message : 'Não foi possível conectar. Confira sua internet e tente novamente.';
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const validEmail = (email: string) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
