import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Flex, Spinner, Text, Box, Button} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useQuery, useQueries} from 'react-query';

import {fetchAccountDetail, fetchTransactionForAccountId} from '../services';
import {useAuthContext} from '../context/AuthContext';

const AccountDetail = ({route, navigation}) => {
  const {userName} = useAuthContext();
  const accountId = route.params.accountId;

  const [
    {data: account, isLoading: isLoadingAccount},
    {data: transactions, isLoading: isLoadingTransactions},
  ] = useQueries([
    {queryKey: ['account-details', {accountId}], queryFn: fetchAccountDetail},
    {
      queryKey: ['transaction', {accountId}],
      queryFn: fetchTransactionForAccountId,
    },
  ]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: Colors.lighter, //isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const goToBuyCoin = () => {
    navigation.push('BuyCoin', {
      account,
    });
  };

  if (isLoadingAccount || isLoadingTransactions) return <Spinner />;

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Flex p="20px">
        <Text color="primary.700" fontSize="2xl">
          {account.data.attributes.title}
        </Text>

        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Text fontSize="lg">
            {`+${account.data.attributes.amount} ${account.data.attributes.currencyCode}`}
          </Text>
          <Button onPress={goToBuyCoin}>Satın al</Button>
        </Flex>
      </Flex>
      {/* son işlemler */}
      <Flex mt="70px" p="15px">
        <Text fontSize="15px">İşlemler</Text>
        {transactions?.map(({id, attributes}) => (
          <Box
            key={id}
            width="100%"
            padding="15px"
            borderBottomWidth="1"
            mb="10px"
            flexDirection="row"
            justifyContent="space-between">
            <Text>{attributes.currencyCode}</Text>
            <Text
              color={
                attributes.toAccount.data.id === accountId
                  ? 'green.600'
                  : 'red.600'
              }>
              {attributes.amount}
            </Text>
          </Box>
        ))}
      </Flex>
    </SafeAreaView>
  );
};

export default AccountDetail;
