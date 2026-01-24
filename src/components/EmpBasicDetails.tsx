import { View, Text, Image, StyleSheet, FlatList, ScrollView } from 'react-native'
import React, { memo, useCallback } from 'react'
import * as Config from '../helpers/Config'
import * as Icons from '../helpers/Icons'

const UserBasicDetails = ({ userData }) => {
    const renderItem = () => {
        return (
            <>
                <View style={[styles.boxContant]}>
                    {/* <Image source={Icons.status_icon} style={styles.image} /> */}
                    <View><Text style={styles.staticText}>NAME</Text><Text style={styles.dynamicText}>{userData?.name}</Text></View>
                </View>
                <View style={[styles.boxContant]}>
                    {/* <Image source={Icons.status_icon} style={styles.image} /> */}
                    <View><Text style={styles.staticText}>Mobile Number</Text><Text style={styles.dynamicText}>{userData?.mobile_no}</Text></View>
                </View>
                <View style={[styles.boxContant]}>
                    {/* <View><Image source={Icons.status_icon} style={styles.image} /></View> */}
                    <View><Text style={styles.staticText}>employee code</Text><Text style={styles.dynamicText}>{userData?.emp_code}</Text></View>
                </View>
                <View style={[styles.boxContant]}>
                    {/* <Image source={Icons.status_icon} style={styles.image} /> */}
                    <View><Text style={styles.staticText}>Employe Detail</Text><Text style={styles.dynamicText}>{userData?.employee_detail}</Text></View>
                </View>
                <View style={[styles.boxContant]}>
                    {/* <Image source={Icons.status_icon} style={styles.image} /> */}
                    <View><Text style={styles.staticText}>Attendance With</Text><Text style={styles.dynamicText}>{userData?.attendance_within}</Text></View>
                </View>
                <View style={[styles.boxContant]}>
                    {/* <Image source={Icons.status_icon} style={styles.image} /> */}
                    <View><Text style={styles.staticText}>Branch</Text><Text style={styles.dynamicText}>{userData?.branch}</Text></View>
                </View>
                <View style={[styles.boxContant]}>
                    {/* <Image source={Icons.status_icon} style={styles.image} /> */}
                    <View><Text style={styles.staticText}>Designation</Text><Text style={styles.dynamicText}>{userData?.designation}</Text></View>
                </View>
                <View style={[styles.boxContant]}>
                    {/* <Image source={Icons.status_icon} style={styles.image} /> */}
                    <View><Text style={styles.staticText}>Employe Category</Text><Text style={styles.dynamicText}>{userData?.employee_category}</Text></View>
                </View>
                <View style={[styles.boxContant]}>
                    {/* <Image source={Icons.status_icon} style={styles.image} /> */}
                    <View><Text style={styles.staticText}>Date of Joining</Text><Text style={styles.dynamicText}>{userData?.date_of_joining}</Text></View>
                </View>
                <View style={[styles.boxContant]}>
                    {/* <Image source={Icons.status_icon} style={styles.image} /> */}
                    <View><Text style={styles.staticText}>Increment Period</Text><Text style={styles.dynamicText}>{userData?.increment_period}</Text></View>
                </View>
            </>
        )
    }
    return (
        <FlatList
            data={[0]}
            removeClippedSubviews
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
        />
    )
}


const styles = StyleSheet.create({
    boxContant: {
        padding: 15,
        borderBottomColor: Config.Colors.borderColor,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    staticText: {
        color: Config.Colors.textColor.textColor_1,
        fontFamily: Config.fontFamilys.Poppins_Medium
    },
    dynamicText: {
        color: Config.Colors.textColor.textColor_2,
        fontFamily: Config.fontFamilys.Poppins_Medium
    },
    image: {
        width: 38,
        height: 38,
        resizeMode: 'contain'
    }
})

export default memo(UserBasicDetails)