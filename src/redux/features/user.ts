import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ApiError } from "../../utils/api";
import { clearAuthToken } from "../../utils/auth";
import {
  exchangeLineAccessToken,
  type LineLoginPayload,
} from "../../utils/lineAuth";
import {
  getCouponsApi,
  getProductsApi,
  getTransactionsApi,
  getUserApi,
  getVipsApi,
  loginWithLineApi,
  logoutApi,
  updateProductsApi,
  updateUserApi,
  type GetCouponsResponse,
  type GetProductsResponse,
  type GetTransactionsResponse,
  type GetUserResponse,
  type GetVipsResponse,
  type LoginWithLineResponse,
  type UpdateProductsPayload,
  type UpdateProductsResponse,
  type UpdateUserPayload,
} from "../../utils/user";

type ApiState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

type UserState = {
  lineLogin: ApiState<LoginWithLineResponse>;
  getUser: ApiState<GetUserResponse>;
  getTransactions: ApiState<GetTransactionsResponse>;
  getVips: ApiState<GetVipsResponse>;
  getCoupons: ApiState<GetCouponsResponse>;
  getProducts: ApiState<GetProductsResponse>;
  updateProfile: ApiState<GetUserResponse>;
  updateProducts: ApiState<UpdateProductsResponse>;
  logout: ApiState<null>;
};

const initialApiState = {
  data: null,
  error: null,
  loading: false,
} satisfies ApiState<null>;

const initialState: UserState = {
  lineLogin: { ...initialApiState },
  getUser: { ...initialApiState },
  getTransactions: { ...initialApiState },
  getVips: { ...initialApiState },
  getCoupons: { ...initialApiState },
  getProducts: { ...initialApiState },
  updateProfile: { ...initialApiState },
  updateProducts: { ...initialApiState },
  logout: { ...initialApiState },
};

function toRejectMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export const lineLogin = createAsyncThunk<
  LoginWithLineResponse,
  LineLoginPayload,
  { rejectValue: string }
>("user/lineLogin", async (payload, { rejectWithValue }) => {
  try {
    const accessToken = await exchangeLineAccessToken(payload);
    const loginData = await loginWithLineApi(accessToken);
    const userData = await getUserApi();
    if (!userData?.user) {
      return rejectWithValue("找不到使用者資料");
    }
    return { ...loginData, user: userData.user };
  } catch (error) {
    return rejectWithValue(toRejectMessage(error, "LINE 登入失敗"));
  }
});

export const getUser = createAsyncThunk<
  GetUserResponse,
  void,
  { rejectValue: string }
>("user/getUser", async (_, { rejectWithValue }) => {
  try {
    const data = await getUserApi();
    if (!data?.user) {
      return rejectWithValue("找不到使用者資料");
    }
    return data;
  } catch (error) {
    return rejectWithValue(toRejectMessage(error, "取得使用者資料失敗"));
  }
});

export const updateProfile = createAsyncThunk<
  GetUserResponse,
  UpdateUserPayload,
  { rejectValue: string }
>("user/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    await updateUserApi(payload);
    const data = await getUserApi();
    if (!data?.user) {
      return rejectWithValue("更新資料失敗");
    }
    return data;
  } catch (error) {
    return rejectWithValue(toRejectMessage(error, "更新資料失敗"));
  }
});

export const getTransactions = createAsyncThunk<
  GetTransactionsResponse,
  void,
  { rejectValue: string }
>("user/getTransactions", async (_, { rejectWithValue }) => {
  try {
    const data = await getTransactionsApi();
    return { transactions: data?.transactions ?? [] };
  } catch (error) {
    return rejectWithValue(toRejectMessage(error, "取得交易紀錄失敗"));
  }
});

export const getVips = createAsyncThunk<
  GetVipsResponse,
  void,
  { rejectValue: string }
>("user/getVips", async (_, { rejectWithValue }) => {
  try {
    const data = await getVipsApi();
    return { vips: data?.vips ?? [] };
  } catch (error) {
    return rejectWithValue(toRejectMessage(error, "取得會員權益失敗"));
  }
});

export const getCoupons = createAsyncThunk<
  GetCouponsResponse,
  void,
  { rejectValue: string }
>("user/getCoupons", async (_, { rejectWithValue }) => {
  try {
    const data = await getCouponsApi();
    return {
      couponCount: data?.couponCount ?? 0,
      coupons: data?.coupons ?? [],
    };
  } catch (error) {
    return rejectWithValue(toRejectMessage(error, "取得優惠券失敗"));
  }
});

export const getProducts = createAsyncThunk<
  GetProductsResponse,
  void,
  { rejectValue: string }
>("user/getProducts", async (_, { rejectWithValue }) => {
  try {
    const data = await getProductsApi();
    return {
      categories: data?.categories ?? [],
      products: data?.products ?? [],
      productIds: (data?.productIds ?? []).map(String),
    };
  } catch (error) {
    return rejectWithValue(toRejectMessage(error, "取得物種失敗"));
  }
});

export const updateProducts = createAsyncThunk<
  UpdateProductsResponse,
  UpdateProductsPayload,
  { rejectValue: string }
>("user/updateProducts", async (payload, { rejectWithValue }) => {
  try {
    const data = await updateProductsApi(payload);
    if (!data?.user) {
      return rejectWithValue("儲存喜歡的物種失敗");
    }
    return data;
  } catch (error) {
    return rejectWithValue(toRejectMessage(error, "儲存喜歡的物種失敗"));
  }
});

export const logout = createAsyncThunk("user/logout", async () => {
  try {
    await logoutApi();
  } catch {
    // clear local session anyway
  } finally {
    clearAuthToken();
    window.location.assign("/login");
  }

  return null;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetLineLogin(state) {
      state.lineLogin = { ...initialApiState };
    },
    resetGetUser(state) {
      state.getUser = { ...initialApiState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(lineLogin.pending, (state) => {
        state.lineLogin.loading = true;
        state.lineLogin.error = null;
      })
      .addCase(lineLogin.fulfilled, (state, action) => {
        state.lineLogin.loading = false;
        state.lineLogin.data = action.payload;
        state.getUser.data = { user: action.payload.user };
        state.getUser.error = null;
      })
      .addCase(lineLogin.rejected, (state, action) => {
        state.lineLogin.loading = false;
        state.lineLogin.data = null;
        state.lineLogin.error =
          action.payload ?? action.error.message ?? "LINE 登入失敗";
      })
      .addCase(getUser.pending, (state) => {
        state.getUser.loading = true;
        state.getUser.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.getUser.loading = false;
        state.getUser.data = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.getUser.loading = false;
        state.getUser.data = null;
        state.getUser.error =
          action.payload ?? action.error.message ?? "取得使用者資料失敗";
      })
      .addCase(getTransactions.pending, (state) => {
        state.getTransactions.loading = true;
        state.getTransactions.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.getTransactions.loading = false;
        state.getTransactions.data = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.getTransactions.loading = false;
        state.getTransactions.data = { transactions: [] };
        state.getTransactions.error =
          action.payload ?? action.error.message ?? "取得交易紀錄失敗";
      })
      .addCase(getVips.pending, (state) => {
        state.getVips.loading = true;
        state.getVips.error = null;
      })
      .addCase(getVips.fulfilled, (state, action) => {
        state.getVips.loading = false;
        state.getVips.data = action.payload;
      })
      .addCase(getVips.rejected, (state, action) => {
        state.getVips.loading = false;
        state.getVips.data = { vips: [] };
        state.getVips.error =
          action.payload ?? action.error.message ?? "取得會員權益失敗";
      })
      .addCase(getCoupons.pending, (state) => {
        state.getCoupons.loading = true;
        state.getCoupons.error = null;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.getCoupons.loading = false;
        state.getCoupons.data = action.payload;
        if (state.getUser.data?.user) {
          state.getUser.data.user.couponCount = action.payload.couponCount;
        }
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.getCoupons.loading = false;
        state.getCoupons.data = { couponCount: 0, coupons: [] };
        state.getCoupons.error =
          action.payload ?? action.error.message ?? "取得優惠券失敗";
      })
      .addCase(getProducts.pending, (state) => {
        state.getProducts.loading = true;
        state.getProducts.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.getProducts.loading = false;
        state.getProducts.data = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.getProducts.loading = false;
        state.getProducts.data = { categories: [], products: [], productIds: [] };
        state.getProducts.error =
          action.payload ?? action.error.message ?? "取得物種失敗";
      })
      .addCase(updateProducts.pending, (state) => {
        state.updateProducts.loading = true;
        state.updateProducts.error = null;
      })
      .addCase(updateProducts.fulfilled, (state, action) => {
        state.updateProducts.loading = false;
        state.updateProducts.data = action.payload;
        state.getUser.data = {
          ...(state.getUser.data ?? { user: action.payload.user }),
          user: action.payload.user,
        };
        state.getUser.error = null;
        const productIds = (action.payload.user.products ?? []).map((item) =>
          String(item.id),
        );
        if (state.getProducts.data) {
          state.getProducts.data.productIds = productIds;
        }
        if (state.lineLogin.data) {
          state.lineLogin.data = {
            ...state.lineLogin.data,
            user: action.payload.user,
          };
        }
      })
      .addCase(updateProducts.rejected, (state, action) => {
        state.updateProducts.loading = false;
        state.updateProducts.error =
          action.payload ?? action.error.message ?? "儲存喜歡的物種失敗";
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateProfile.loading = true;
        state.updateProfile.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfile.loading = false;
        state.updateProfile.data = action.payload;
        state.getUser.data = action.payload;
        state.getUser.error = null;
        if (state.lineLogin.data) {
          state.lineLogin.data = {
            ...state.lineLogin.data,
            user: action.payload.user,
            isNew: false,
          };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfile.loading = false;
        state.updateProfile.error =
          action.payload ?? action.error.message ?? "更新資料失敗";
      })
      .addCase(logout.pending, (state) => {
        state.logout.loading = true;
        state.logout.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.logout.loading = false;
        state.logout.data = null;
        state.lineLogin = { ...initialApiState };
        state.getUser = { ...initialApiState };
        state.getTransactions = { ...initialApiState };
        state.getVips = { ...initialApiState };
        state.getCoupons = { ...initialApiState };
        state.getProducts = { ...initialApiState };
        state.updateProfile = { ...initialApiState };
        state.updateProducts = { ...initialApiState };
      })
      .addCase(logout.rejected, (state, action) => {
        state.logout.loading = false;
        state.logout.error = action.error.message ?? "登出失敗";
      });
  },
});

export const { resetLineLogin, resetGetUser } = userSlice.actions;
export default userSlice.reducer;
