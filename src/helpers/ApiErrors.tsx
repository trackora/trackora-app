import { Alert } from 'react-native';

export const ApiErrors = (currentState, _backToLogin) => {
  console.log('currentState', currentState);
  if (currentState?.error?.message) {
    Alert.alert(
      'User Register',
      `${currentState?.error?.response?.data?.message}`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => _backToLogin() },
      ],
    );
  } else if (currentState?.data) {
    Alert.alert('User Register', `${currentState?.data?.message}`, [
      { text: 'OK', onPress: () => _backToLogin() },
    ]);
  } else if (currentState?.data?.id) {
    Alert.alert('User Register', `User Register Successfully `, [
      { text: 'OK', onPress: () => _backToLogin() },
    ]);
  }
};
