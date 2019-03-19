import React, { Component } from 'react';

import {
  View, Text, TextInput, TouchableOpacity, StatusBar, AsyncStorage,ActivityIndicator
} from 'react-native';

import styles from './styles';
import { colors } from '~/styles'
import api from '~/service/api'

export default class Welcome extends Component {
  state = {
    username: '',
    loading: false,
    error: false,
  }

  checkUserExist = async (username) => {
    const user = await api.get(`/users/${username}`)
    return user
  }

  saveUser = async (username) => {
    await AsyncStorage.setItem('@Githuber:username', username);
  }

  signIn = async () => {
    const { username } = this.state;
    const { navigation } = this.props;

    this.setState({ loading: true });
    try {
      await this.checkUserExist(username);
      await this.saveUser(username);
      navigation.navigate('Repositories');
    }catch(error) {
      this.setState({ loading: false, error: true });
    }
  }

  render() {
    const { username, loading, error } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.secundary} barStyle="light-content"/>
        <Text style={styles.title}>Bem Vindo!</Text>
        <Text style={styles.text}>
          Para continuarmos precisamos que você informe seu usuário do Github
        </Text>

        { error && <Text style={styles.error}>Usuário inexistente</Text> }

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Digite seu usuário"
            underlineColorAndroid="transparent"
            value={username}
            onChangeText={text => this.setState({ username: text })}
          />

          <TouchableOpacity style={styles.button} onPress={this.signIn}>
            { loading ? <ActivityIndicator size="small" color="#FFF"/> : <Text style={styles.buttonText}>Acessar</Text> }
          </TouchableOpacity>
        </View>
    </View>
    );
  }
}
