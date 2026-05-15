// Auth service orchestrates API + local state
import { loginUser, registerUser } from './auth.api';

export const register = async (payload) => {
  try {
    const result = await registerUser(payload);
    if (!result.ok) {
      throw new Error(result.message || 'Registration failed');
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const authenticate = async (credentials) => {
  try {
    const result = await loginUser(credentials);
    if (!result.ok) {
      throw new Error(result.message || 'Login failed');
    }
    return result;
  } catch (error) {
    throw error;
  }
};
