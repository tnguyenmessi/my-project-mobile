import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi } from '../api/auth';

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    { username, password, rememberMe }: { username: string; password: string; rememberMe: boolean },
    { rejectWithValue }
  ) => {
    try {
      const token = await loginApi(username, password, rememberMe);
      return token;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Đăng nhập thất bại');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.error = null;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setError } = authSlice.actions;
export default authSlice.reducer; 