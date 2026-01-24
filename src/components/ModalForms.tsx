import { View, Text, StyleSheet } from 'react-native'
import React, { Fragment } from 'react'
import * as Config from  '../helpers/Config'
export function ModalForms() {
    return (
        <View>
            <Text>ModalForms</Text>
        </View>
    )
}




const styles = StyleSheet.create({
    calendar: {
        marginBottom: 10,
        borderRadius:20
    },
    switchContainer: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center'
    },
    switchText: {
        margin: 10,
        fontSize: 16
    },
    text: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: Config.Colors.themeColor,
        fontSize: 16,
        color:Config.Colors.defaultColor
    },
    disabledText: {
        color: 'grey'
    },
    defaultText: {
        color: 'purple'
    },
    customCalendar: {
        height: 250,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    customDay: {
        textAlign: 'center'
    },
    customHeader: {
        backgroundColor: '#FCC',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: -4,
        padding: 8
    },
    customTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    customTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00BBF2'
    }
});