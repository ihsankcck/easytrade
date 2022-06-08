import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {Text} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const AccountDetail = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text>kkkk</Text>
    </SafeAreaView>
  );
};

export default AccountDetail;
