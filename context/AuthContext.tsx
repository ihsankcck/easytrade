import React, {
  FC,
  useReducer,
  useEffect,
  createContext,
  useContext,
} from 'react';
import {useMutation} from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {LoginRequest, login} from '../services';

interface StateTypes {
  token: string | undefined;
  userName: string | undefined;
  email: string | undefined;
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
      };
    }
  | {
      type: 'SIGN_IN';
      payload: {
        token: string;
        userName: string;
        email: string;
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
      };
  }
};

export const AuthContextProvider: FC = ({children}) => {
  const {mutateAsync: loginMutation} = useMutation(login);

  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    isSignout: false,
    token: undefined,
    userName: undefined,
    email: undefined,
  });

  console.log(state);

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userInfo;

      try {
        const storageUserInfo = await AsyncStorage.getItem('userInfo');
        if (storageUserInfo) {
          userInfo = JSON.parse(storageUserInfo)?.token;
        }
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', payload: userInfo});
    };

    bootstrapAsync();
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
      dispatch({type: 'SIGN_OUT'});
    },
    signUp: async () => {
      // In a production app, we need to send user data to server and get a token
      // We will also need to handle errors if sign up failed
      // After getting token, we need to persist the token using `SecureStore`
      // In the example, we'll use a dummy token
      //   dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
    },
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext) as AuthContextValue;
