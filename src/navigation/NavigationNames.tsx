import * as BottomNavigation from './BottomNavigation';
import * as Icons from '../helpers/Icons.js';
import * as Config from '../helpers/Config.js';
import AboutUs from '../screens/user/AboutUs';
import Alarm from '../screens/user/Alarm';
import Attendance from '../screens/user/Attendance';
import AttendanceLeaveDetails from '../screens/user/AttendanceLeaveDetails';
import Chat from '../screens/user/Chat';
import ContactUs from '../screens/user/ContactUs';
import Documents from '../screens/user/Documents';
import Enquiry from '../screens/user/Enquiry';
import HolidayList from '../screens/user/HolidayList';
import MyProfile from '../screens/user/MyProfile';
import Notes from '../screens/user/Notes';
import Notification from '../screens/user/Notification';
import Posters from '../screens/user/Posters';
import RequestLeave from '../screens/user/RequestLeave';
import AdminNotification from '../screens/admin/Notification';
import ManageAttendance from '../screens/admin/ManageAttendance';
import Branchs from '../screens/admin/Branchs';
import EmployesList from '../screens/admin/EmployesList';
import LeaveRequests from '../screens/admin/LeaveRequests';
import Reports from '../screens/admin/Reports';
import Biometric from '../screens/admin/Biometric';
import SalaryDetails from '../screens/admin/SalaryDetails';
import Home from '../screens/admin/Home.js';
import Settings from '../screens/admin/Settings.js';
import Privacy_Policy from '../screens/user/Privacy_Policy.js';
import Terms_Conditions from '../screens/user/Terms_Conditions.js';
import Shift from '../screens/user/Shift.js';
import Break from '../screens/user/Break.js';
import DeviceVerification from '../screens/user/(account-settings)/_components/DeviceVerification.jsx';

export const stackNames = [
  {
    name: 'botomTab',
    component: BottomNavigation.BottomTabs,
  },
  {
    name: 'attendanceLeaveDetails',
    component: AttendanceLeaveDetails,
    initialParams: { name: 'attendance_leave_details' },
  },
  {
    name: 'posters',
    component: Posters,
    initialParams: { name: 'posters' },
  },
  {
    name: 'documents',
    component: Documents,
    initialParams: { name: 'documents' },
  },
  {
    name: 'attendance',
    component: Attendance,
    initialParams: { name: 'attendance' },
  },
  {
    name: 'my_profile',
    component: MyProfile,
    initialParams: { name: 'MyProfile' },
  },
  {
    name: 'terms-conditions',
    component: Terms_Conditions,
    initialParams: { name: 'terms-conditions' },
  },
  {
    name: 'privacy-policy',
    component: Privacy_Policy,
    initialParams: { name: 'privacy-policy' },
  },
  {
    name: 'contact',
    component: ContactUs,
    initialParams: { name: 'contactUs' },
  },
  {
    name: 'about',
    component: AboutUs,
    initialParams: { name: 'aboutUs' },
  },
  {
    name: 'feedback',
    component: Enquiry,
    initialParams: { name: 'feedback' },
  },

  {
    name: 'leave-request',
    component: RequestLeave,
    initialParams: { name: 'leave-request' },
  },
  {
    name: 'notification',
    component: Notification,
    initialParams: { name: 'notification' },
  },
  {
    name: 'holiday-list',
    component: HolidayList,
    initialParams: { name: 'holiday-list' },
  },
  {
    name: 'device-verification',
    component: DeviceVerification,
    initialParams: { name: 'device-verification' },
  },
  {
    name: 'shift',
    component: Shift,
    initialParams: { name: 'shift' },
  },
  {
    name: 'break',
    component: Break,
    initialParams: { name: 'break' },
  },
  {
    name: 'chat',
    component: Chat,
    initialParams: { name: 'chatUs' },
  },
  {
    name: 'notes',
    component: Notes,
    initialParams: { name: 'notes' },
  },
  {
    name: 'branchs',
    component: Branchs,
    initialParams: { name: 'branchs' },
  },
  {
    name: 'employesList',
    component: EmployesList,
    initialParams: { name: 'emp_list' },
  },
  {
    name: 'alarm',
    component: Alarm,
    initialParams: { name: 'alarm' },
  },
];

export const adminStackNames = [
  {
    name: 'botomTab',
    component: BottomNavigation.AdminBottomTabs,
  },
  {
    name: 'admin_notification',
    component: AdminNotification,
    initialParams: { name: 'notification' },
  },
  {
    name: 'manage_attendance',
    component: ManageAttendance,
    initialParams: { name: 'manage_attendance' },
  },
  {
    name: 'my_profile',
    component: MyProfile,
    initialParams: { name: 'myProfile' },
  },
  {
    name: 'contact',
    component: ContactUs,
    initialParams: { name: 'contact' },
  },
  {
    name: 'branchs',
    component: Branchs,
    initialParams: { name: 'branchs' },
  },
  {
    name: 'about',
    component: AboutUs,
    initialParams: { name: 'aboutUs' },
  },
  {
    name: 'employesList',
    component: EmployesList,
    initialParams: { name: 'emp_list' },
  },
  {
    name: 'leaveRequests',
    component: LeaveRequests,
    initialParams: { name: 'leaveReq' },
  },
  {
    name: 'reports',
    component: Reports,
    initialParams: { name: 'reports' },
  },
  {
    name: 'biometric',
    component: Biometric,
    initialParams: { name: 'biometric' },
  },
  {
    name: 'salaryDetails',
    component: SalaryDetails,
    initialParams: { name: 'sal_details' },
  },
  {
    name: 'alarm',
    component: Alarm,
    initialParams: { name: 'alarm' },
  },
];

export const adminBottomTabsNames = [
  {
    name: 'home',
    component: Home,
    initialParams: { name: 'home' },
    options: {
      tabBarLabel: 'home',
      iconSource: Icons?.home_icon,
    },
  },
  {
    name: 'settings',
    component: Settings,
    initialParams: { name: 'settings' },
    options: {
      tabBarLabel: 'settings',
      iconSource: Icons?.settings_icon,
    },
  },
];
