import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, BackHandler } from 'react-native'
import React from 'react'

const CustomModal = ({
    animationType = 'fade',
    transparent = true,
    modalVisible = true,
    onRequestClose,
    disableOnPress = false,
    children,
    alignItems = 'center',
    justifyContent = 'center',
    backgroundColor = 'rgba(0,0,0,0.5)',
}) => {


    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onRequestClose,
        );
        return () => backHandler.remove();
    }, []);
    return (
        <View style={styles.container}>
            <Modal
                animationType={animationType}
                transparent={transparent}
                visible={modalVisible}
                onRequestClose={onRequestClose}
            >
                {disableOnPress ? (<TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: alignItems,
                        justifyContent: justifyContent,
                        backgroundColor: backgroundColor,
                    }}
                    activeOpacity={1}
                    onPressOut={() => onRequestClose()}>
                    <View >
                        <TouchableWithoutFeedback>
                            <View >
                                {children}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableOpacity>) : (<View
                    style={{
                        flex: 1,
                        alignItems: alignItems,
                        justifyContent: justifyContent,
                        backgroundColor: backgroundColor,
                    }}>
                    {children}

                </View>)
                }

            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
export default CustomModal