import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Dimensions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  Pressable,
  HStack,
  Badge,
  Spacer,
  Box,
  Flex,
  IconButton,
  Icon,
  Text,
  Spinner,
} from 'native-base';
import Carousel from 'react-native-snap-carousel';
import {useQueries} from 'react-query';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {useAuthContext} from '../context/AuthContext';

import {fetchAccountsByUserId, fetchTransactionForUserId} from '../services';

const {width: viewportWidth} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const Home = ({navigation}) => {
  const {userId} = useAuthContext();
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);

  const [
    {data: accounts, isLoading: isLoadingAccount},
    {data: transactions, isLoading: isLoadingTransactions},
  ] = useQueries([
    {queryKey: ['accounts', {userId}], queryFn: fetchAccountsByUserId},
    {
      queryKey: ['transaction-for-userId', {userId}],
      queryFn: fetchTransactionForUserId,
    },
  ]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: Colors.lighter, //isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const goToAccountDetail = (accountId: number) => {
    navigation.push('AccountDetail', {accountId});
  };

  const goToTransferPage = (type: string) => {
    const activeAccount = accounts?.data[activeAccountIndex];
    navigation.push(type === 'receive' ? 'TransferReceive' : 'TransferSend', {
      accountNo: activeAccount?.attributes?.no,
      accountId: activeAccount?.id,
      currencyCode: activeAccount?.attributes?.currencyCode,
    });
  };

  const goToNewAccount = () => {
    navigation.push('NewAccount');
  };

  const handleChangeCarousel = (activeIndex: number) => {
    setActiveAccountIndex(activeIndex);
  };

  const getIsUserAccount = accountId => {
    return accounts?.data?.length
      ? accounts.data?.some(account => account.id === accountId)
      : false;
  };

  const carouselItem = ({item}) => {
    return (
      <Pressable onPress={() => goToAccountDetail(item.id)}>
        {({isPressed}) => {
          return (
            <Box
              maxW="96"
              borderWidth="1"
              borderColor="coolGray.300"
              shadow="3"
              height="100%"
              bg={{
                linearGradient: {
                  colors: ['success.400', 'primary.300'],
                  start: [0, 0],
                  end: [1, 0],
                },
              }}
              p="5"
              rounded="8"
              style={{
                transform: [
                  {
                    scale: isPressed ? 0.96 : 1,
                  },
                ],
              }}>
              <HStack alignItems="center">
                <Badge
                  colorScheme="darkBlue"
                  _text={{
                    color: 'white',
                  }}
                  variant="solid"
                  rounded="4">
                  {item.attributes.title}
                </Badge>
                <Spacer />
                <Text fontSize={15} color="coolGray.800">
                  {item.attributes.currencyCode}
                </Text>
              </HStack>
              <Text
                color="coolGray.800"
                mt="3"
                fontWeight="medium"
                fontSize="xl">
                +{item.attributes.amount}
              </Text>
            </Box>
          );
        }}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <Flex justifyContent="flex-start" flex="1" pt="20px">
        <Flex flex="3">
          {isLoadingAccount ? (
            <Spinner accessibilityLabel="Loading Accounts" />
          ) : accounts?.data?.length ? (
            <Carousel
              data={accounts?.data ?? []}
              renderItem={carouselItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              onSnapToItem={handleChangeCarousel}
            />
          ) : (
            <Pressable onPress={goToNewAccount}>
              {({isPressed}) => {
                return (
                  <Box
                    maxW="96"
                    borderWidth="1"
                    borderColor="coolGray.300"
                    shadow="3"
                    height="100%"
                    ml={itemHorizontalMargin / 2}
                    bg={{
                      linearGradient: {
                        colors: ['success.400', 'primary.300'],
                        start: [0, 0],
                        end: [1, 0],
                      },
                    }}
                    p="5"
                    rounded="8"
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}>
                    <Flex alignItems="center" flex="1" justifyContent="center">
                      <Text fontSize="xl" color="coolGray.800">
                        Yeni hesap oluştur
                      </Text>
                      <Icon
                        color="coolGray.800"
                        size="3xl"
                        as={Entypo}
                        name="plus"
                      />
                    </Flex>
                  </Box>
                );
              }}
            </Pressable>
          )}
        </Flex>
        {/* iconButton */}
        {accounts?.data?.length ? (
          <Flex
            padding="15px"
            flex="1"
            flexDirection={'row'}
            justifyContent={'space-around'}
            mt={15}>
            <Box alignItems="center">
              <IconButton
                icon={<Icon as={Entypo} name="align-bottom" />}
                borderRadius="full"
                onPress={() => goToTransferPage('receive')}
                bgColor={'green.200'}
                _icon={{
                  color: 'black',
                  size: 'md',
                }}
                _pressed={{
                  _icon: {
                    name: 'align-bottom',
                  },
                  _ios: {
                    _icon: {
                      size: '2xl',
                    },
                  },
                }}
                _ios={{
                  _icon: {
                    size: '2xl',
                  },
                }}
              />
            </Box>
            <Box alignItems="center">
              <IconButton
                icon={<Icon as={Entypo} name="align-top" />}
                onPress={() => goToTransferPage('send')}
                borderRadius="full"
                bgColor={'red.200'}
                _icon={{
                  color: 'black',
                  size: 'md',
                }}
                _pressed={{
                  _icon: {
                    name: 'direction',
                  },
                  _ios: {
                    _icon: {
                      size: '2xl',
                    },
                  },
                }}
                _ios={{
                  _icon: {
                    size: '2xl',
                  },
                }}
              />
            </Box>
          </Flex>
        ) : null}
        {/* son işlemler */}
        <Flex flex="5" mt="70px" p="15px">
          <Text fontSize="15px">Son İşlemler</Text>
          {isLoadingTransactions ? (
            <Spinner accessibilityLabel="Loading Accounts" />
          ) : transactions?.length ? (
            transactions?.map(({id, attributes}) => (
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
                    getIsUserAccount(attributes?.toAccount?.data?.id)
                      ? 'green.600'
                      : 'red.600'
                  }>
                  {attributes.amount}
                </Text>
              </Box>
            ))
          ) : (
            <Text mt="20" textAlign="center" fontSize="xl" color="gray.700">
              Henüz bir işleminiz yok
            </Text>
          )}
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

export default Home;
