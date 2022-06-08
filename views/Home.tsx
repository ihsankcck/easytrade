import React from 'react';
import {
  SafeAreaView,
  //ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
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
} from 'native-base';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useAuthContext} from '../context/AuthContext';

const Home = ({navigation}) => {
  const {signOut, userName} = useAuthContext();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const goToAccountDetail = () => {
    navigation.push('AccountDetail');
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <Flex justifyContent="flex-start" flex="1" p="10">
        {/* linearBox */}
        <Flex flex="3">
          <Pressable onPress={goToAccountDetail}>
            {({isHovered, isFocused, isPressed}) => {
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
                      Business
                    </Badge>
                    <Spacer />
                    <Text fontSize={15} color="coolGray.800">
                      TL
                    </Text>
                  </HStack>
                  <Text
                    color="coolGray.800"
                    mt="3"
                    fontWeight="medium"
                    fontSize="xl">
                    +20.000
                  </Text>
                </Box>
              );
            }}
          </Pressable>
        </Flex>
        {/* iconButton */}
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
        {/* son işlemler */}
        <Flex flex="5" mt="70px">
          <Text fontSize="15px">Son İşlemler</Text>
          <Box
            width="100%"
            padding="15px"
            borderBottomWidth="1"
            mb="10px"
            flexDirection="row"
            justifyContent="space-between">
            <Text>BTC</Text>
            <Text color="red.600">2000</Text>
          </Box>
          <Box
            width="100%"
            padding="15px"
            borderBottomWidth="1"
            mb="10px"
            flexDirection="row"
            justifyContent="space-between">
            <Text>BTC</Text>
            <Text color="green.600">2000</Text>
          </Box>
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
  },

  header: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },

  highlight: {
    fontWeight: '700',
  },
});

export default Home;
