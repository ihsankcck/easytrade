import React, {FC} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Flex, Button, Input, FormControl} from 'native-base';

import {LoginRequest} from '../services';
import {useAuthContext} from '../context/AuthContext';

const LoginView: FC = ({navigation}) => {
  const {signIn, isLoading} = useAuthContext();

  const {handleSubmit, control} = useForm<LoginRequest>({
    defaultValues: {
      identifier: 'ihsankck',
      password: '123456789',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    signIn(data);
  };

  return (
    <>
      <Flex flex={1} p="50px" bg="white">
        <Controller
          control={control}
          render={({field: {onChange, onBlur, name, value}}) => (
            <FormControl>
              <FormControl.Label>E posta</FormControl.Label>
              <Input
                isDisabled={isLoading}
                size="xl"
                name={name}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              <FormControl.ErrorMessage>
                Try different from previous passwords.
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          name="identifier"
          rules={{required: true}}
        />
        <Controller
          control={control}
          render={({field: {onChange, onBlur, name, value}}) => (
            <FormControl>
              <FormControl.Label>Şifre</FormControl.Label>
              <Input
                isDisabled={isLoading}
                size="xl"
                type="password"
                name={name}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              <FormControl.ErrorMessage>
                Try different from previous passwords.
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          name="password"
          rules={{required: true}}
        />

        <Button
          mt="20px"
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}>
          Giriş yap
        </Button>
      </Flex>
    </>
  );
};

export default LoginView;
