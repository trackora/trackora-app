import React from 'react'
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native'
import PushNotification from 'react-native-push-notification';

const ListAlarms = (props) => {
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <View>
          <View>
            <Text style={styles.titleStyle}>{item?.date?.toTimeString()}</Text>
            <Text>{item?.date?.toLocaleString()}</Text>
          </View>
          <Pressable
            style={styles.buttonStyle}
            onPress={() => {
              PushNotification.cancelLocalNotification(item?.alarmNotifData?.id);
              console.log("Alarm Deleted with ID: " + item?.alarmNotifData?.id);
            }}>
            <Text style={styles.buttonText}>REMOVE</Text>

          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <FlatList
      keyExtractor={keyExtractor}
      data={props.alarms}
      renderItem={renderItem} />
  );
}



const styles = StyleSheet.create({
  titleStyle: {
    fontWeight: 'bold',
    fontSize: 23
  },
  container:{
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    elevation: 20,
    padding: 10,
  },
  buttonText: {
    fontSize: 15,
    //fontWeight:'bold',
    color: 'white'
  }
});


export default ListAlarms;