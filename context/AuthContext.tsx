import React, {
  FC,
  useReducer,
  useEffect,
  createContext,
  useContext,
} from 'react';
import {useMutation} from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LoginRequest, login, register} from '../services';

interface StateTypes {
  token: string | undefined;
  userName: string | undefined;
  email: string | undefined;
  userId: number | undefined;
  isLoading: boolean;
  isSignout: boolean;
}

interface AuthContextValue extends StateTypes {
  signIn: (data: LoginRequest) => void;
  signUp: () => void;
  signOut: () => void;
}

type ACTIONTYPE =
  | {
      type: 'RESTORE_TOKEN';
      payload: {
        token: string;
        userName: string;
        email: string;
        userId: number;
      };
    }
  | {
      type: 'SIGN_IN';
      payload: {
        token: string;
        userName: string;
        email: string;
        userId: number;
      };
    }
  | {type: 'SIGN_OUT'};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const reducer = (prevState: StateTypes, action: ACTIONTYPE): StateTypes => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        isLoading: false,
        ...action.payload,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        ...action.payload,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        token: undefined,
        userName: undefined,
        email: undefined,
        userId: undefined,
      };
  }
};

export const AuthContextProvider: FC = ({children}) => {
  const {mutateAsync: loginMutation, isLoading: isLoginLoading} =
    useMutation(login);
  const {mutateAsync: registerMutation, isLoading: isRegisterLoading} =
    useMutation(register);

  const [state, dispatch] = useReducer(reducer, {
    isSignout: true,
    token: undefined,
    userName: undefined,
    email: undefined,
    userId: undefined,
    isLoading: isLoginLoading || isRegisterLoading,
  });

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    // const bootstrapAsync = async () => {
    //   let userInfo;
    //   try {
    //     const storageUserInfo = await AsyncStorage.getItem('userInfo');
    //     if (storageUserInfo) {
    //       userInfo = JSON.parse(storageUserInfo);
    //     }
    //   } catch (e) {
    //     // Restoring token failed
    //   }
    //   // After restoring token, we may need to validate it in production apps
    //   // This will switch to the App screen or Auth screen and this loading
    //   // screen will be unmounted and thrown away.
    //   dispatch({type: 'RESTORE_TOKEN', payload: userInfo});
    // };
    // bootstrapAsync();

    AsyncStorage.setItem('userInfo', '');
    dispatch({type: 'SIGN_OUT'});
  }, []);

  const authContext = {
    ...state,
    signIn: async (data: LoginRequest) => {
      loginMutation(data, {
        onSuccess: response => {
          const payload = {
            token: response.jwt,
            email: response.user.email,
            userName: response.user.username,
            userId: response.user.id,
          };

          AsyncStorage.setItem('userInfo', JSON.stringify(payload));

          dispatch({
            type: 'SIGN_IN',
            payload,
          });
        },
        onError: err => {
          console.log(err);
        },
      });
    },
    signOut: () => {
      AsyncStorage.setItem('userInfo', '');
      dispatch({type: 'SIGN_OUT'});
    },
    signUp: async data => {
      return registerMutation(data, {
        onSuccess: response => {
          const payload = {
            token: response.jwt,
            email: response.user.email,
            userName: response.user.username,
            userId: response.user.id,
          };
          AsyncStorage.setItem('userInfo', JSON.stringify(payload));
          dispatch({
            type: 'SIGN_IN',
            payload,
          });
        },
        onError(error) {
          throw error;
        },
      });
    },
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext) as AuthContextValue;
