import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://cms.gallant-wiles.37-140-242-109.plesk.page',
});

Api.interceptors.request.use(
  async config => {
    const userInfoRaw = await AsyncStorage.getItem('userInfo');
    const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : '';

    if (userInfo && config && config.headers) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export interface LoginRequest {
  identifier: string;
  password: string;
}

export const login = async (loginParams: LoginRequest) => {
  try {
    const response = await Api.post('auth/local', loginParams);
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const register = async registerParams => {
  try {
    const response = await Api.post('auth/local/register', registerParams);
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const newAccount = async newAccountParams => {
  try {
    const response = await Api.post('accounts', newAccountParams);
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const updateAccount = async ({id, ...newAccountParams}) => {
  try {
    const response = await Api.put(`accounts/${id}`, newAccountParams);
    return response?.data;
  } catch (err) {
    throw err;
  }
};

export const transferAmount = async transferParams => {
  const response = await Api.post('transactions', transferParams);
  return response?.data;
};

export const fetchAccounts = async () => {
  const response = await Api.get('accounts');
  return response.data;
};

export const fetchAccountsByUserId = async ({queryKey}) => {
  const [_key, {userId}] = queryKey;
  const response = await Api.get('accounts', {
    params: {
      'filters[user][id][$eq]': userId,
      populate: '*',
    },
  });

  return response.data;
};

export const fetchAccountDetail = async ({queryKey}) => {
  const [_key, {accountId}] = queryKey;
  try {
    const response = await Api.get(`accounts/${accountId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const fetchTransactionForAccountId = async ({queryKey}) => {
  const [_key, {accountId}] = queryKey;
  const [fromAccountResponse, toAccountResponse] = await Promise.all([
    Api.get('transactions', {
      params: {
        'filters[fromAccount][id][$eq]': accountId,
        populate: '*',
      },
    }),
    Api.get('transactions', {
      params: {
        'filters[toAccount][id][$eq]': accountId,
        populate: '*',
      },
    }),
  ]);

  return [
    ...(fromAccountResponse?.data?.data ?? []),
    ...(toAccountResponse?.data?.data ?? []),
  ]
    .sort(
      (transaction1, transaction2) =>
        new Date(transaction1?.attributes?.createdAt) -
        new Date(transaction2?.attributes?.createdAt),
    )
    .reverse();
};

export const fetchTransactionForUserId = async ({queryKey}) => {
  const [_key, {userId}] = queryKey;
  const [fromAccountResponse, toAccountResponse] = await Promise.all([
    Api.get('transactions', {
      params: {
        'filters[fromAccount][user][id][$eq]': userId,
        'populate[toAccoount]': '*',
      },
    }),
    Api.get('transactions', {
      params: {
        'filters[toAccount][user][id][$eq]': userId,
        'populate[toAccount]': '*',
      },
    }),
  ]);

  return [
    ...(fromAccountResponse?.data?.data ?? []),
    ...(toAccountResponse?.data?.data ?? []),
  ]
    .sort(
      (transaction1, transaction2) =>
        new Date(transaction1?.attributes?.createdAt) -
        new Date(transaction2?.attributes?.createdAt),
    )
    .reverse();
};
