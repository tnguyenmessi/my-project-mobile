import EncryptedStorage from 'react-native-encrypted-storage';
import { xmlRpcClient } from './xmlRpcClient';

const TOKEN_KEY = 'auth_token';

export interface LoginCredentials {
  username: string;
  password: string;
}

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const result = await xmlRpcClient.call('dokuwiki.login', [
        credentials.username,
        credentials.password,
      ]);

      if (result) {
        this.token = result;
        await this.saveToken(result);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await xmlRpcClient.call('dokuwiki.logoff');
      this.token = null;
      await this.removeToken();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      const token = await EncryptedStorage.getItem(TOKEN_KEY);
      if (token) {
        this.token = token;
      }
      return token;
    } catch (error) {
      console.error('Failed to get stored token:', error);
      return null;
    }
  }

  private async saveToken(token: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save token:', error);
      throw error;
    }
  }

  private async removeToken(): Promise<void> {
    try {
      await EncryptedStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = AuthService.getInstance();

export async function loginApi(
  username: string,
  password: string,
  rememberMe: boolean
): Promise<string> {
  try {
    const result = await xmlRpcClient.call('dokuwiki.login', [username, password]);
    if (result) {
      if (rememberMe) {
        await EncryptedStorage.setItem('auth_token', username); // Hoặc lưu token nếu DokuWiki trả về
      }
      return username; // Hoặc trả về token nếu DokuWiki trả về
    } else {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  } catch (error) {
    throw error;
  }
}
