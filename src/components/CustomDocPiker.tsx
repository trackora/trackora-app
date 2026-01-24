import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { heightToDp, widthToDp } from '../helpers/Responsive'
import * as Icons from '../helpers/Icons'
import * as Config from '../helpers/Config'
import * as Constants from '../helpers/Constants'
const CustomDocPiker = ({
     uploadFile, 
     onRequestClose 
    }) => {
    return (
        <View style={{
            width: widthToDp(100),
            height: heightToDp(20),
            backgroundColor: '#fff',
            // borderRadius: widthToDp(2),
            padding: widthToDp(5),
        }}>
            <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontSize: widthToDp(5), fontFamily: Config.fontFamilys.Poppins_SemiBold, color: Config.Colors.black }}>Upload Documents</Text>
                    </View>
                    <TouchableOpacity
                        onPress={onRequestClose}
                        style={{
                            // width: widthToDp(10),
                            // height: heightToDp(5),
                            // elevation: 2,
                            // borderRadius: 20,
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            // backgroundColor: "#fff",
                            // borderColor: Config.Colors.borderColor,
                            // borderWidth: .5
                        }}>
                        <Image source={Icons?.close} style={{ width: widthToDp(9), height: heightToDp(4) }} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text style={{
                        borderBottomWidth: 2,
                        borderStyle: "solid",
                        borderBottomColor: Config.Colors.borderColor,
                        width: widthToDp(90),
                    }}></Text>
                </View>
                <View style={{ gap: widthToDp(2), marginTop: widthToDp(3), flexDirection: "row", justifyContent: 'space-around' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', gap: widthToDp(2), justifyContent: 'center', alignItems: 'center' }} onPress={() => uploadFile()} >
                        <View style={{
                            width: widthToDp(10),
                            height: heightToDp(5),
                            elevation: 2,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: "#fff",
                            borderColor: Config.Colors.borderColor,
                            // borderWidth: .5
                        }}>
                            <Image source={Icons?.gallery_icon} style={{ width: widthToDp(4), height: heightToDp(2) }} resizeMode='contain' />
                        </View>
                        <Text style={{ fontSize: widthToDp(4), fontFamily: Config.fontFamilys.Poppins_Medium, color: Config.Colors.black }}>From Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', gap: widthToDp(2), justifyContent: 'center', alignItems: 'center' }} onPress={() => uploadFile('openCamera')} >
                        <View style={{
                            width: widthToDp(10),
                            height: heightToDp(5),
                            elevation: 2,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: "#fff",
                            borderColor: Config.Colors.borderColor,
                            // borderWidth: .5
                        }}>
                            <Image source={Icons?.camera_icon} style={{ width: widthToDp(4), height: heightToDp(2) }} resizeMode='contain' />
                        </View>
                        <Text style={{ fontSize: widthToDp(4), fontFamily: Config.fontFamilys.Poppins_Medium, color: Config.Colors.black }}>Take Picture</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CustomDocPiker