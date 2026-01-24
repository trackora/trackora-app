import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import * as Config from '../helpers/Config'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';


const CELL_COUNT = 4;

// Inspired by
// https://github.com/retyui/react-native-confirmation-code-field/issues/129
// https://dribbble.com/shots/8020632/attachments/530078?mode=media

const OtpConfim = ({ onChange, backgroundColor, textColor }) => {
    const [enableMask, setEnableMask] = useState(false);
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const toggleMask = () => setEnableMask((f) => !f);
    const renderCell = ({ index, symbol, isFocused }) => {
        let textChild = null;

        if (symbol) {
            textChild = enableMask ? '•' : symbol;
        } else if (isFocused) {
            textChild = <Cursor />;
        }

        return (
            <View    key={index}style={[styles.cellOter, { backgroundColor: backgroundColor}]} >
                <Text
                    style={[styles.cell, isFocused && styles.focusCell, {color: textColor }]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {textChild}
                </Text>
            </View>
        );
    };
    const handleChange = (text) => {
        setValue(text);
        onChange(text);
    }
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.fieldRow}>
                <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={(text) => handleChange(text)}
                    cellCount={CELL_COUNT}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={renderCell}
                    autoComplete={"one-time-code"}
                />
                {/* <Text style={styles.toggle} onPress={toggleMask}>
                {enableMask ? '🙈' : '🐵'}
            </Text> */}
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    // root: { padding: 20, minHeight: 300 },
    // title: { textAlign: 'center', fontSize: 30 },
    fieldRow: {
        // marginTop: 20,
        flexDirection: 'row',

    },
    cellOter:{
        width: 55,
        height: 55,
        marginLeft: 8,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cell: {
        fontSize: 20,
        fontWeight: Config.WEIGHTS.medium,
        fontFamily: Config.fontFamilys.Poppins_SemiBold,
        color: Config.Colors.textColor.textColor_2,

    },
    toggle: {
        width: 55,
        height: 55,
        lineHeight: 55,
        fontSize: 44,
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
});
export default OtpConfim;


/*

Concept: https://dribbble.com/shots/5476562-Forgot-Password-Verification/attachments

*/