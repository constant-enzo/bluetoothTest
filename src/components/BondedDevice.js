import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';

export default class BondedDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {connected: false, message: ''};
    this.device = this.props.device;
  }

  componentDidMount() {
    this.isConnected();
  }

  isConnected = async () => {
    try {
      let isConnected = await this.device?.isConnected();
      if (isConnected) {
        this.setState({connected: true});
      }
    } catch (err) {
      console.log(err);
    }
  };
  connect = async () => {
    console.log(
      '--ATTEMPTING CONNECTION TO DEVICE: ' + this.device.name + ' --',
    );
    console.log(this.device);
    try {
      let isConnected = await this.device?.isConnected();
      console.log('isConnected?', isConnected);
      if (!isConnected) {
        isConnected = await this.device.connect();
        if (isConnected) {
          this.setState({connected: true});
        }
        console.log('isConnected2', isConnected);
      }
    } catch (err) {
      console.log(err);
    }
  };

  disconnect = async () => {
    console.log('--ATTEMPTING TO DISCONNECT: ' + this.device.name + ' --');
    try {
      let disconnected = await this.device.disconnect();
      this.setState({connected: !disconnected});
      console.log('connected:' + this.state.connected);
    } catch (err) {
      console.log(err);
    }
  };

  read = async () => {
    console.log('-- READING DEVICE --');
    try {
      let message = await this.props.device.read();
      console.log(message);
      this.setState({message: message});
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.device_container}>
          <Text style={styles.title}>{this.device.name}</Text>
          <TouchableHighlight
            underlayColor="white"
            activeOpacity={0.6}
            onPress={this.state.connected ? this.disconnect : this.connect}>
            <Text style={styles.button}>
              {this.state.connected ? 'DISCONNECT' : 'CONNECT'}
            </Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          onPress={this.read}
          underlayColor="white"
          activeOpacity={0.6}>
          <View style={styles.button}>
            <Text> READ</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.output_container}>
          <Text>{this.state.message}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 10,
  },
  device_container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  output_title: {textAlign: 'center'},
  output_container: {borderWidth: 2, margin: 5},
  title: {fontSize: 20},
  touchable: {margin: 5, backgroundColor: 'blue'},
  touchableText: {fontSize: 10, margin: 10},
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,
  },
});
