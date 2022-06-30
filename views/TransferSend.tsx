import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Dimensions,
  Alert,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {AmountInput} from 'react-native-amount-input';
import {RNCamera} from 'react-native-camera';
import {Flex, Spinner, Text, Box, Input} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useMutation} from 'react-query';

import {transferAmount} from '../services';
import {useAuthContext} from '../context/AuthContext';

const {width: viewportWidth} = Dimensions.get('window');

const TransferSend = ({route, navigation}) => {
  const [amount, setAmount] = useState(0);
  const {userName} = useAuthContext();
  const {accountId, currencyCode} = route?.params;
  const {mutateAsync: transferMutation} = useMutation(transferAmount);

  // const [
  //   {data: account, isLoading: isLoadingAccount},
  //   {data: transactions, isLoading: isLoadingTransactions},
  // ] = useQueries([
  //   {queryKey: ['account-details', {accountId}], queryFn: fetchAccountDetail},
  //   {
  //     queryKey: ['transaction', {accountId}],
  //     queryFn: fetchTransactionForAccountId,
  //   },
  // ]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: Colors.lighter, //isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const handleChangeQuantity = quantity => {
    if (quantity > 0) {
      setAmount(quantity);
    }
  };

  const onSuccess = event => {
    if (amount <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir tutar giriniz!', [
        {
          text: 'Kapat',
          style: 'cancel',
        },
      ]);
      return;
    }

    try {
      const qrValue = event?.data;
      const toAccount = JSON.parse(qrValue);
      const transferRequest = {
        data: {
          amount,
          currencyCode,
          fromAccount: accountId,
          toAccount: toAccount?.accountId,
        },
      };

      transferMutation(transferRequest, {
        onSuccess: () => {
          Alert.alert(
            'Başarılı',
            `${toAccount.accountNo} no'lu hesaba ${amount} ${currencyCode} tutarında transfer işlemi gerçekleşmiştir`,
            [
              {
                text: 'Tamam',
                style: 'default',
                onPress: () => navigation.push('Account'),
              },
            ],
          );
        },
        onError: err => {
          Alert.alert(
            'Hata',
            err?.response?.data?.error?.message ?? err?.message,
            [
              {
                text: 'Kapat',
                style: 'cancel',
              },
            ],
          );
        },
      });
    } catch (error) {
      console.error('An error occured', error);
    }
  };
  // if (isLoadingAccount || isLoadingTransactions) return <Spinner />;

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Box p="20px">
        <Text color="primary.700" fontSize="lg">
          Para transferi gerçekleştirmek için QR kodu tarayınız
        </Text>

        <AmountInput
          currency={currencyCode}
          defaultQuantity={amount}
          onChangeQuantity={handleChangeQuantity}
          TextInputComponent={Input}
        />
      </Box>

      <Flex flex={1} alignItems="center" justifyContent="center">
        <QRCodeScanner
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.torch}
        />
      </Flex>
    </SafeAreaView>
  );
};

export default TransferSend;
