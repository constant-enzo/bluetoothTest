import React, {Component} from 'react';

import {
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  View,
  Button,
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothEventType,
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import BondedDevice from './src/components/BondedDevice';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
      bondedDevices: {},
      device: null,
      connected: false,
      connectedDevice: {},
    };
  }

  componentDidMount() {
    this.checkBluetoothEnabled();
    this.getBondedDevices();
  }

  checkBluetoothEnabled = async () => {
    console.log('-- CHECKING BLUETOOTH STATUS');
    let isEnabled = false;
    try {
      isEnabled = await RNBluetoothClassic.isBluetoothEnabled();
      console.log('BT STATUS:' + (isEnabled ? 'ENABLED' : 'DISABLED'));
      this.setState({enabled: isEnabled});
    } catch (err) {
      console.log(err);
    }
  };

  getBondedDevices = async () => {
    console.log('-- GETTING BONDED DEVICES --');
    let listBondedDevices = {};
    try {
      listBondedDevices = await RNBluetoothClassic.getBondedDevices();
      let interestingList = [];
      listBondedDevices.forEach(device => {
        if (device.name.includes('Jabra') || device.name.includes('LOG')) {
          interestingList.push(device);
        }
      });
      this.setState({bondedDevices: interestingList});
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.btStatusContainer}>
          <Text style={styles.btStatusTitle}>Bluetooth status</Text>
          <Text
            style={[
              styles.btStatus,
              {color: this.state.enabled ? 'green' : 'red'},
            ]}>
            {this.state.enabled ? 'ON' : 'OFF'}
          </Text>
        </View>

        <FlatList
          style={styles.list}
          data={this.state.bondedDevices}
          renderItem={({item}) => <BondedDevice device={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  btStatusContainer: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  btStatusTitle: {fontSize: 20},
  btStatus: {fontSize: 40},
});

export default App;
