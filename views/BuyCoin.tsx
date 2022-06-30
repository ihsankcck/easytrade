import React, {FC, useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Flex, Button, Input, Select, FormControl} from 'native-base';
import {useMutation} from 'react-query';
import {AmountInput} from 'react-native-amount-input';
import price from 'crypto-price';

import {updateAccount} from '../services';
import {useAuthContext} from '../context/AuthContext';
import {queryClient} from '../context/QueryContext';

const CryptoPrices = {
  btc: 333369.67,
  eth: 18188.8,
};

const BuyCoin: FC = ({navigation, route}) => {
  const {account} = route?.params;
  const currencyCode = account?.data?.attributes?.currencyCode;

  const {userId} = useAuthContext();
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {mutateAsync: accountMutation, isLoading: mutationLoading} =
    useMutation(updateAccount);

  const handleSubmit = async () => {
    accountMutation(
      {
        id: account?.data?.id,
        data: {
          amount:
            account?.data?.attributes?.amount +
            amount / CryptoPrices[currencyCode],
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
          console.log(err);
        },
      },
    );
  };

  const handleChangeQuantity = quantity => {
    if (quantity > 0) {
      setAmount(quantity);
    }
  };

  return (
    <>
      <Flex flex={1} p="50px" bg="white">
        <FormControl isRequired>
          <FormControl.Label>Miktar</FormControl.Label>
          <AmountInput
            currency="try"
            defaultQuantity={amount}
            onChangeQuantity={handleChangeQuantity}
            TextInputComponent={Input}
          />
        </FormControl>

        <Button mt="20px" isLoading={isLoading} onPress={handleSubmit}>
          {`${currencyCode} Satın al`}
        </Button>
      </Flex>
    </>
  );
};

export default BuyCoin;
