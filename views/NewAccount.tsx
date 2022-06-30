import React, {FC} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Flex, Button, Input, Select, FormControl} from 'native-base';
import {useMutation} from 'react-query';

import {newAccount} from '../services';
import {useAuthContext} from '../context/AuthContext';
import {queryClient} from '../context/QueryContext';

const NewAccount: FC = ({navigation}) => {
  const {userId} = useAuthContext();
  const {mutateAsync: accountMutation, isLoading} = useMutation(newAccount);

  const {handleSubmit, control, setError} = useForm({
    defaultValues: {
      title: '',
      currencyCode: '',
    },
  });

  const onSubmit = async data => {
    accountMutation(
      {
        data: {
          ...data,
          user: userId,
        },
      },
      {
        onSuccess: async response => {
          queryClient.refetchQueries(['accounts'], {
            active: true,
          });
          navigation.push('Account');
        },
        onError: err => {
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
        },
      },
    );
  };

  return (
    <>
      <Flex flex={1} p="50px" bg="white">
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Lütfen hesap başlığı alanını doldurunuz',
            },
          }}
          render={({
            field: {onChange, onBlur, name, value},
            fieldState: {error},
          }) => (
            <FormControl isRequired isInvalid={!!error?.message}>
              <FormControl.Label>Hesap başlığı</FormControl.Label>
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
          name="title"
        />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Lütfen birim seçimi yapınız',
            },
          }}
          render={({
            field: {onChange, onBlur, name, value},
            fieldState: {error},
          }) => (
            <FormControl isRequired isInvalid={!!error?.message}>
              <FormControl.Label>Birim</FormControl.Label>
              <Select
                size="xl"
                selectedValue={value}
                minWidth="200"
                accessibilityLabel="Para birimi seçiniz"
                placeholder="Para birimi seçiniz"
                _selectedItem={{
                  bg: 'teal.600',
                }}
                mt={1}
                onValueChange={itemValue => onChange(itemValue)}>
                <Select.Item label="Bitcoin" value="btc" />
                <Select.Item label="Etherium" value="eth" />
              </Select>
              <FormControl.ErrorMessage>
                {error?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )}
          name="currencyCode"
        />

        <Button
          mt="20px"
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}>
          Hesap aç
        </Button>
      </Flex>
    </>
  );
};

export default NewAccount;
