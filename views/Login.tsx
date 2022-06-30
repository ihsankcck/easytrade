import React, {FC} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Flex, Button, Input, FormControl} from 'native-base';

import {LoginRequest} from '../services';
import {useAuthContext} from '../context/AuthContext';

const LoginView: FC = ({navigation}) => {
  const {signIn, isLoading} = useAuthContext();

  const goToRegisterPage = () => {
    navigation.push('Register');
  };

  const {handleSubmit, control} = useForm<LoginRequest>({
    defaultValues: {
      identifier: '',
      password: '',
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
          rules={{
            required: {
              value: true,
              message: 'Lütfen kullanıcı adı/e-posta alanını doldurunuz',
            },
          }}
          render={({
            field: {onChange, onBlur, name, value},
            fieldState: {error},
          }) => (
            <FormControl isRequired isInvalid={!!error?.message}>
              <FormControl.Label>E-posta/Kullanıcı Adı</FormControl.Label>
              <Input
                isDisabled={isLoading}
                size="xl"
                name={name}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              <FormControl.ErrorMessage>
                {error?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          name="identifier"
        />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Lütfen Şifre alanını doldurunuz',
            },
          }}
          render={({
            field: {onChange, onBlur, name, value},
            fieldState: {error},
          }) => (
            <FormControl isRequired isInvalid={!!error?.message}>
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
                {error?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          name="password"
        />

        <Button
          mt="20px"
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}>
          Giriş yap
        </Button>

        <Button
          mt="20px"
          transparent
          isLoading={isLoading}
          onPress={goToRegisterPage}>
          Kayıt ol
        </Button>
      </Flex>
    </>
  );
};

export default LoginView;
