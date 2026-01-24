import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import * as Config from '../helpers/Config'
import * as Icons from '../helpers/Icons'
import { useTranslation } from 'react-i18next'
import { widthToDp } from '../helpers/Responsive'
import { CustomLinearButton } from './CustomElements'
import { toLocaleDateString } from '../helpers/utils'
const EmpSalaryDetails = ({ userData, pageLoader, selectedMonth }) => {
    const { t } = useTranslation()
    return (
        <>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.rupesIcon}>₹</Text>
                    <View style={{gap:pageLoader?10:0}}>
                        {pageLoader ?
                            <ActivityIndicator size={widthToDp(10)} />
                            : <Text style={{ fontFamily: Config.fontFamilys.Poppins_Medium, fontSize: widthToDp(10), color: Config.Colors.green, }}>{userData?.total_salary_received}</Text>}
                        {/* <Text style={{
                            fontSize: widthToDp(3), fontFamily: Config.fontFamilys.Poppins_Medium, color: Config.Colors.textColor.textColor_1, marginTop: -10
                        }}>Salary Pending {`${toLocaleDateString(selectedMonth).month_name} ${toLocaleDateString(selectedMonth).year}`}</Text> */}
                    </View>
                </View>
            </View>
            {/* <View style={{ flexDirection: 'row', gap: 15, marginTop: 20 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <CustomLinearButton commonWidth={widthToDp(43)} text={t(Config.salaryScreenText?.calculate_salary)} color={Config.Colors.defaultColor} fontSize={widthToDp(3.5)} borderRadius={10} />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <CustomLinearButton commonWidth={widthToDp(43)} text={t(Config.salaryScreenText?.pay_advance)} color={Config.Colors.defaultColor} fontSize={widthToDp(3.5)} borderRadius={10} />
                </View>
            </View> */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, gap: 10 }}>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.total_holidays}</Text>
                        <Text style={styles.boxStaticText}>Weekly Off / Holidays</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.total_working_days}</Text>
                        <Text style={styles.boxStaticText}>Total Working Days</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.total_working_hours}</Text>
                        <Text style={styles.boxStaticText}>Total Working Hours</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.salary_wages}</Text>
                        <Text style={styles.boxStaticText}>Monthly Salary</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.hourly_salary}</Text>
                        <Text style={styles.boxStaticText}>{t(Config.salaryScreenText?.hourly_salary)}</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.levarage_excess}</Text>
                        <Text style={styles.boxStaticText}>Leverage (+)</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.levarage_less}</Text>
                        <Text style={styles.boxStaticText}>Leverage (-)</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.total_hours_worked}</Text>
                        <Text style={styles.boxStaticText}>Total Hours worked</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.excess}</Text>
                        <Text style={styles.boxStaticText}>Excess</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.less}</Text>
                        <Text style={styles.boxStaticText}>Less</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.salary_received}</Text>
                        <Text style={styles.boxStaticText}>Salary Recieved</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.emi_cycle}</Text>
                        <Text style={styles.boxStaticText}>EMI</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.total_salary_received}</Text>
                        <Text style={styles.boxStaticText}>Total Salary Recieved</Text>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    {/* <Image source={Icons.basis_pay} style={styles.boxImage} /> */}
                    <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                        <Text style={styles.boxDyanamixText}>{userData?.monthly_bonus}</Text>
                        <Text style={styles.boxStaticText}>Monthly Bonus</Text>
                    </View>
                </View>
            </View>
            <View style={{ borderBottomColor: Config.Colors.borderColor, borderBottomWidth: 2, paddingBottom: 10, width: widthToDp(100), marginLeft: -20 }}>
            </View>
            {/* <View style={{ marginTop: 10 }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={{ fontFamily: Config.fontFamilys.Poppins_Medium, fontSize: widthToDp(5), color: Config.Colors.textColor.textColor_2, }}>{t(Config.salaryScreenText?.payment_history)}</Text>
                    </View>
                    <View style={{ width: widthToDp(10), height: widthToDp(10), backgroundColor: Config.Colors.backgroundColors.bg_3, borderRadius: 6 }}>
                        <Image source={Icons.arrow_right} style={{ width: widthToDp(10), height: widthToDp(10), resizeMode: 'contain', tintColor: Config.Colors.textColor.textColor_1 }} />
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: widthToDp(10) }}>
                    <Text style={{ fontFamily: Config.fontFamilys.Poppins_Medium, fontSize: widthToDp(5), color: Config.Colors.textColor.textColor_2, }}>{t(Config.salaryScreenText?.no_payment_added)}</Text>
                </View>
            </View> */}
        </>
    )
}
const styles = StyleSheet.create({
    rupesIcon: { fontFamily: Config.fontFamilys.Poppins_Medium, fontSize: widthToDp(5), alignItems: 'flex-end', justifyContent: 'flex-end', color: Config.Colors.textColor.textColor_2, paddingRight: 5 },
    boxContainer: { backgroundColor: Config.Colors.backgroundColors.bg_2, justifyContent: 'center', alignItems: "center", borderRadius: 10, width: widthToDp(27.5), height: widthToDp(28), },
    boxImage: { width: widthToDp(8), height: widthToDp(8), resizeMode: 'contain', paddingBottom: widthToDp(10) },
    boxDyanamixText: { fontFamily: Config.fontFamilys.Poppins_Medium, fontSize: widthToDp(5), alignItems: 'center', justifyContent: 'center', color: Config.Colors.textColor.textColor_2, alignSelf: 'center' },
    boxStaticText: { fontFamily: Config.fontFamilys.Poppins_Medium, fontSize: widthToDp(2.5), alignItems: 'flex-end', justifyContent: 'flex-end', color: Config.Colors.textColor.textColor_2, paddingRight: 5,textAlign:'center' }
})
export default EmpSalaryDetails