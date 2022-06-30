import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Dimensions,
} from 'react-native';
import QRCode from 'react-qr-code';
import {Flex, Text, Box} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const {width: viewportWidth} = Dimensions.get('window');

const TransferReceive = ({route}) => {
  const {accountNo, accountId} = route?.params;

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: Colors.lighter, //isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  // if (isLoadingAccount || isLoadingTransactions) return <Spinner />;

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Box p="20px">
        <Text color="primary.700" fontSize="lg">
          Para transferi gerçekleştirmek için QR kodu okutunuz
        </Text>
      </Box>

      <Flex flex={1} alignItems="center" justifyContent="center">
        <QRCode
          value={JSON.stringify({
            accountNo,
            accountId,
          })}
          size={viewportWidth - 100}
        />
      </Flex>
    </SafeAreaView>
  );
};

export default TransferReceive;
