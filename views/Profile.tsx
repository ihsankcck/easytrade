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
import {Button, Box, Flex, IconButton, Icon, Text} from 'native-base';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useAuthContext} from '../context/AuthContext';

const Profile = ({navigation}) => {
  const {email, signOut, userName} = useAuthContext();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: Colors.lighter, //isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const goToNewAccount = () => {
    navigation.navigate('NewAccount');
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Flex justifyContent="flex-start" flex="1" p="10">
        <Flex flex="1">
          <Text fontSize="30px">Merhaba {userName};</Text>
          <Text fontSize="15px" color="primary.700">
            {email}
          </Text>

          <Button
            mt="20px"
            onPress={goToNewAccount}
            leftIcon={<Icon color="white" size="xl" as={Entypo} name="plus" />}>
            Yeni Hesap Aç
          </Button>
        </Flex>
        <Flex>
          <Button onPress={signOut}>Çıkış</Button>
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

export default Profile;
