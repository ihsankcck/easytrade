import React, {FC} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Flex, Button, Input, FormControl} from 'native-base';

import {useAuthContext} from '../context/AuthContext';

const RegisterView: FC = ({navigation}) => {
  const {signUp, isLoading} = useAuthContext();

  const {handleSubmit, control, setError} = useForm({
    defaultValues: {
      username: '',
      password: '',
      email: '',
    },
  });

  const onSubmit = async data => {
    try {
      await signUp(data);
    } catch (err) {
      const errors = err?.response?.data?.error?.details?.errors;
      if (!errors?.length) return;

      errors.forEach(error => {
        if (error?.name === 'ValidationError') {
          error?.path?.forEach(path => {
            setError(path, {
              message: error?.message,
            });
          });
        }
      });
    }
  };

  return (
    <>
      <Flex flex={1} p="50px" bg="white">
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Lütfen kullanıcı adı alanını doldurunuz',
            },
          }}
          render={({
            field: {onChange, onBlur, name, value},
            fieldState: {error},
          }) => (
            <FormControl isRequired isInvalid={!!error?.message}>
              <FormControl.Label>Kullanıcı adı</FormControl.Label>
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
          name="username"
        />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Lütfen E-Posta alanını doldurunuz',
            },
          }}
          render={({
            field: {onChange, onBlur, name, value},
            fieldState: {error},
          }) => (
            <FormControl isRequired isInvalid={!!error?.message}>
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
                {error?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          name="email"
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
          Kayıt ol
        </Button>
      </Flex>
    </>
  );
};

export default RegisterView;
