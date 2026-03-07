import * as Icons from './Icons';
export const GOOGLE_MAP_APIKEY = 'AIzaSyA_2_umC2_jpfUFfRRMjteOOM1l2xEHcwM';
export const baseUrl = 'https://karbit-hrms-app-u67tp.ondigitalocean.app';
export const FCM_SERVER_KEY =
  'c2tLx-aWTMiSlLNYaCMCiq:APA91bGbRKY_QWoD0LXiYZWVZbKOeleizFCAXHVLzKJLKbEsxmQnLCZ2fctr0cis3ePet_wTNOK0mUWbhmt6y50c_-oquFfD94BKeYKg4HlzJ3b04kdpL5gaOZgx-_2z4vNInKl3yrRS';
export const themeBgColor = '#00579c';
export const errorMessage = {
  validateEmail_error_message: 'Please enter Valid email address',
  validateNumber_error_message: 'Please enter Valid Phone Number',
  password_error_message: 'Password must be greater than 3 words',
};

// User Role
export const isUserRole = 1;
export const isAdminRole = 2;

export const WEIGHTS: Record<
  'regular' | 'bold' | 'semibold' | 'medium' | 'light' | 'extraBold',
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
> = {
  regular: 'normal',
  bold: 'bold',
  semibold: '500',
  medium: '600',
  light: '300',
  extraBold: '900',
};
export const fontFamilys = {
  Poppins_Black: 'Poppins-Black',
  Poppins_BlackItalic: 'Poppins-BlackItalic',
  Poppins_Bold: 'Poppins-Bold',
  Poppins_BoldItalic: 'Poppins-BoldItalic',
  Poppins_ExtraBold: 'Poppins-ExtraBold',
  Poppins_ExtraBoldItalic: 'Poppins-ExtraBoldItalic',
  Poppins_ExtraLightItalic: 'Poppins-ExtraLightItalic',
  Poppins_Italic: 'Poppins-Italic',
  Poppins_Light: 'Poppins-Light',
  Poppins_LightItalic: 'Poppins-LightItalic',
  Poppins_Medium: 'Poppins-Medium',
  Poppins_MediumItalic: 'Poppins-MediumItalic',
  Poppins_Regular: 'Poppins-Regular',
  Poppins_SemiBold: 'Poppins-SemiBold',
  Poppins_SemiBoldItalic: 'Poppins-SemiBoldItalic',
  Poppins_Thin: 'Poppins-Thin',
  Poppins_ThinItalic: 'Poppins-ThinItalic',
};

export const Colors = {
  statusBarColor: '#3085FE',
  primary: '#254E71',
  secondary: '#AE3B45',
  inputField: '#F6F6F6',
  bodyBg: '#F5F5F5',
  errorField: '#FFE8E8',
  errorText: '#BD0000',
  successField: '#F5FFEA',
  successText: '#6FB423',
  defaultColor: '#FFF',
  white: '#FFFFFF',
  offWite: '#F8F8F8',
  offWhite: '#F8F8F8',
  attendenceIcon: '#3085FE',
  lineColor: '#3085FE',
  inputField_1: '#E4E4E4',
  themeColor: '#3085FE',
  errorFieldBorder: '#f02424',
  lightSecondary: '#FFCACA',
  black: '#000',
  borderColor: '#D5D5D5',
  bottomColor: '#B2B9C1',
  red: '#FF0000',
  searchBgInput: '#ECECEC',
  searchBriderInput: '#C6CACF',
  yellow: '#f5b400',
  green: '#6fb423',
  cyan_blue: '#f6fbff',
  grey:"gray",
  RGBAColors: {
    primary: 'rgba(32, 78, 113, 1.0)',
    secondary: 'rgba(173, 59, 68, 1.0)',
    inputField: '#F6F6F6',
    bodyBg: '#F5F5F5',
    errorField: '#FFE8E8',
    errorText: '#BD0000',
    successField: '#F5FFEA',
    successText: '#6FB423',
    defaultColor: '#fff',
    lineColor: 'rgba(32, 68, 97, 1.0)',
    inputField_1: 'rgba(228, 228, 228, 1.0)',
    themeColor: 'rgba(32, 68, 97, 1.0)',
  },
  textColor: {
    textColor_1: '#99a2ad',
    textColor_2: '#001832',
  },
  backgroundColors: {
    bg_1: '#f6faf9',
    bg_2: '#cbb3b5',
    bg_3: '#e4e4e5',
  },
};

export const lineColor = {
  color1: '#3085FE',
  color2: '#3085FE',
};

export const yourActivityArray = [
  {
    status: true,
    title: 'leave_attendance',
    icon: Icons?.Leave_attendance,
    des: 'leave_att_description',
    textColor: '',
    otherArray: [
      // {
      //     status: false,
      //     title: 'Make Your Poster',
      //     icon: Icons?.edit_picture,
      //     des: 'Enjoy good morning wishes & many more arts.',
      //     textColor: ''
      // },
      {
        status: true,
        title: 'documents',
        icon: Icons?.document,
        des: 'doc_description',
        textColor: '',
      },
      {
        status: true,
        title: 'chatUs',
        icon: Icons?.document,
        des: 'chatUs_description',
        textColor: '',
      },
    ],
  },
];

export const adminHomeData = [
  {
    status: true,
    title: 'manageEmp',
    icon: Icons?.employee_list_icon,
    textColor: '',
    des: '',
    // otherArray: [
    //     // {
    //     //     status: false,
    //     //     title: 'Make Your Poster',
    //     //     icon: Icons?.edit_picture,
    //     //     des: 'Enjoy good morning wishes & many more arts.',
    //     //     textColor: ''
    //     // },
    //     {
    //         status: true,
    //         title: 'documents',
    //         icon: Icons?.document,
    //         des: 'doc_description',
    //         textColor: ''
    //     },
    //     {
    //         status: true,
    //         title: 'chatUs',
    //         icon: Icons?.document,
    //         des: 'chatUs_description',
    //         textColor: ''
    //     },
    // ]
  },
  {
    status: true,
    title: 'manageBranch',
    icon: Icons?.branches_icon,
    textColor: '',
    des: '',
  },
  {
    status: true,
    title: 'leaveReq',
    icon: Icons?.branches_icon,
    textColor: '',
    des: '',
  },
];
export const LeaveAttendanceArray = [
  {
    status: true,
    title: 'view_attendance',
    icon: Icons?.Leave_attendance,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'reqLeave',
    icon: Icons?.request_Leave,
    des: '',
    textColor: '',
  },
  {
    status: false,
    title: 'holiday-list',
    icon: Icons?.holidays_Lists,
    des: '',
    textColor: '',
  },
];

export const editPictureArray = [
  {
    status: true,
    title: 'Good Morning Wishes',
    icon: Icons?.good_morning_wishes,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'Christmas Day Wishes',
    icon: Icons?.christmas_day_wishes,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'Good Night Wishes',
    icon: Icons?.good_night_wishes,
    des: '',
    textColor: '',
  },
];
export const userSalaryDetailsHeader = [
  {
    status: true,
    title: 'user_details',
    icon: Icons?.good_morning_wishes,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'attendance',
    icon: Icons?.good_morning_wishes,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'salary',
    icon: Icons?.good_morning_wishes,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'notes',
    icon: Icons?.good_morning_wishes,
    des: '',
    textColor: '',
  },
];

export const menuArray: { heading: string; items: unknown[] }[] = [];

// export const menuArray = [
//   {
//     heading: 'Account Settings',
//     items: [
//       {
//         title: 'My Branches',
//         slug: 'my-branches',
//         icon: 'storefront',
//         route: '/account/branches',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Reports',
//         slug: 'reports',
//         icon: 'file-chart',
//         route: '/account/reports',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Device Verification Request',
//         slug: 'device-verification-request',
//         icon: 'shield-check',
//         route: '/account/device-verification',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Manage Employee',
//         slug: 'manage-employee',
//         icon: 'users',
//         route: '/account/manage-employee',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//     ],
//   },
//   {
//     heading: 'Attendance Settings',
//     items: [
//       {
//         title: 'Leave Request',
//         slug: 'leave-request',
//         icon: 'calendar-minus',
//         route: '/attendance/leave-request',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Holiday List',
//         slug: 'holiday-list',
//         icon: 'calendar-star',
//         route: '/attendance/holidays',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Manage Biometric',
//         slug: 'manage-biometric',
//         icon: 'fingerprint',
//         route: '/attendance/biometric',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Break',
//         slug: 'break',
//         icon: 'coffee',
//         route: '/attendance/break',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Shift',
//         slug: 'shift',
//         icon: 'clock',
//         route: '/attendance/shift',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//     ],
//   },
//   {
//     heading: 'Finance',
//     items: [
//       {
//         title: 'Expenses',
//         slug: 'expenses',
//         icon: 'expense-icon',
//         route: '/expenses',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//     ],
//   },
//   {
//     heading: 'My Account',
//     items: [
//       {
//         title: 'Profile',
//         slug: 'profile',
//         icon: 'profile-icon',
//         route: '/profile',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//     ],
//   },
//   {
//     heading: 'Other Settings',
//     items: [
//       {
//         title: 'Refer and Earn',
//         slug: 'refer-and-earn',
//         icon: 'gift',
//         route: '/settings/refer-earn',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Select Company',
//         slug: 'select-company',
//         icon: 'building',
//         route: '/settings/select-company',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Request a Feature',
//         slug: 'request-feature',
//         icon: 'lightbulb',
//         route: '/settings/request-feature',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Request Account Deletion',
//         slug: 'request-account-deletion',
//         icon: 'user-minus',
//         route: '/settings/account-deletion',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Logout',
//         slug: 'logout',
//         icon: 'log-out',
//         route: '/logout',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//     ],
//   },
//   {
//     heading: 'Sales',
//     items: [
//       {
//         title: 'Leads',
//         slug: 'leads',
//         icon: 'lead-icon',
//         route: '/leads',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Follow-up',
//         slug: 'followup',
//         icon: 'followup-icon',
//         route: '/followup',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//     ],
//   },
//   {
//     heading: 'Shortcuts',
//     items: [
//       {
//         title: 'Leave Request',
//         slug: 'leave-request',
//         icon: 'calendar-minus',
//         route: '/attendance/leave-request',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Expenses',
//         slug: 'expenses',
//         icon: 'expense-icon',
//         route: '/expenses',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Leads',
//         slug: 'leads',
//         icon: 'lead-icon',
//         route: '/leads',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Checkin',
//         slug: 'leads',
//         icon: 'lead-icon',
//         route: '/leads',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Enquiry',
//         slug: 'leads',
//         icon: 'lead-icon',
//         route: '/leads',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//       {
//         title: 'Follow-up',
//         slug: 'followup',
//         icon: 'followup-icon',
//         route: '/followup',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//     ],
//   },
//   {
//     heading: 'Work Management',
//     items: [
//       {
//         title: 'Documents',
//         slug: 'documents',
//         icon: 'document-icon',
//         route: '/documents',
//         permissions: {
//           view: false,
//           add: false,
//           edit: false,
//           delete: false,
//         },
//       },
//     ],
//   },
// ];
export const addminSettings = [
  // {
  //     status: true,
  //     title: 'manageBranch',
  //     icon: Icons?.branches_icon,
  //     des: '',
  //     textColor: ''
  // },
  // {
  //     status: true,
  //     title: 'manageEmp',
  //     icon: Icons?.employee_list_icon,
  //     des: '',
  //     textColor: "",
  //     tintColor: "#ed6d74"
  // },
  // {
  //     status: true,
  //     title: 'leaveReq',
  //     icon: Icons?.request_Leave,
  //     des: '',
  //     textColor: "",
  //     tintColor: "#ed6d74"
  // },
  {
    status: false,
    title: 'reports',
    icon: Icons?.reports_icon,
    des: '',
    textColor: '',
    tintColor: '#ed6d74',
  },
  {
    status: false,
    title: 'biometric',
    icon: Icons?.biometric_icon,
    des: '',
    textColor: '',
    tintColor: '#ed6d74',
  },
  {
    status: true,
    title: 'myProfile',
    icon: Icons?.my_profile,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'contactUs',
    icon: Icons?.contact_us,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'aboutUs',
    icon: Icons?.about_us,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'deleteAccount',
    icon: Icons?.delete_account,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'language',
    icon: Icons?.language,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'logout',
    icon: Icons?.logout,
    des: '',
    textColor: '',
  },
];

export const attendanceArray = [
  {
    name: 'present',
    backgroundColor: '#f5faf6',
    borderColor: '#05f545',
    number: 0,
  },
  {
    name: 'absent',
    backgroundColor: '#f9f5f4',
    borderColor: '#da2f35',
    number: 10,
  },
  {
    name: 'halfDays',
    backgroundColor: '#faf8f1',
    borderColor: '#f0d37d',
    number: 20,
  },
  {
    name: 'paidLeave',
    backgroundColor: '#faf5fa',
    borderColor: '#d279d2',
    number: 30,
  },
];

export const subSettings = [
  {
    status: true,
    title: 'My Branchs',
    icon: Icons?.branch_icon,
    des: '',
    textColor: '',
  },
  {
    status: false,
    title: 'Reports (Comming soon)',
    icon: Icons?.reports_icon,
    des: '',
    textColor: '',
  },
  {
    status: false,
    title: 'Device Verification Request (Comming soon)',
    icon: Icons?.finger_print,
    des: '',
    textColor: '',
  },
  {
    status: false,
    title: 'Make Branch or Attendence Manager (Comming soon)',
    icon: Icons?.branch_icon,
    des: '',
    textColor: '',
  },
  {
    status: true,
    title: 'Inactive Employes',
    icon: Icons?.inactive_candidate,
    des: '',
    textColor: '',
    tintColor: '#ed6d74',
  },
];
export const AttendanceSubSettings = [
  {
    status: false,
    title: 'Multiple Punch In (Comming soon)',
    icon: Icons?.branch_icon,
    des: '',
    textColor: '',
  },
  {
    status: false,
    title: 'Auto Present (Comming soon)',
    icon: Icons?.user_account,
    des: '',
    textColor: '',
    tintColor: '#ed6d74',
  },
  {
    status: false,
    title: 'Auto Live Track (Comming soon)',
    icon: Icons?.location_icon,
    des: '',
    textColor: '',
    tintColor: '#ed6d74',
  },
  {
    status: false,
    title: 'QR Codes Attendence (Comming soon)',
    icon: Icons?.qr_code_icon,
    des: '',
    textColor: '',
    tintColor: '#ed6d74',
  },
  {
    status: false,
    title: 'QR Codes (Comming soon)',
    icon: Icons?.qr_code_icon,
    des: '',
    textColor: '',
    tintColor: '#ed6d74',
  },
  {
    status: false,
    title: 'Selfie Attendence (Comming soon)',
    icon: Icons?.camera_icon,
    des: '',
    textColor: '',
    tintColor: '#ed6d74',
  },
  {
    status: false,
    title: 'Leave Request (Comming soon)',
    icon: Icons?.request_Leave,
    des: '',
    textColor: '',
  },
  {
    status: false,
    title: 'Holiday List (Comming soon)',
    icon: Icons?.holidays_Lists,
    des: '',
    textColor: '',
  },
  {
    status: false,
    title: 'Manage BioMetric (Comming soon)',
    icon: Icons?.finger_print,
    des: '',
    textColor: '',
  },
];
export const items = [
  {
    id: '1', // acts as primary key, should be unique and non-empty string
    label: 'Option 1',
    value: 'option1',
  },
  {
    id: '2',
    label: 'Option 2',
    value: 'option2',
  },
  {
    id: '3',
    label: 'Option 3',
    value: 'option3',
  },
  {
    id: '4',
    label: 'Option 4',
    value: 'option3',
  },
  {
    id: '5',
    label: 'Option 5',
    value: 'option4',
  },
];
export const LeaveTypes = ['halfDay', 'fullDay', 'sickLeave'];
export const enquiryType = [
  { label: 'Events', value: 'Events' },
  { label: 'Meeting Conference', value: 'Meeting Conference' },
];

export const CompanyReports = [
  {
    title: 'attendance',
    icon: Icons.attendance_icon,
    data: [
      {
        title: 'attendance_summary_report',
      },
      {
        title: 'detailed_attendance_report',
      },
      {
        title: 'leaveReport',
      },
      {
        title: 'overtime_report',
      },
    ],
  },
  {
    title: 'salary',
    icon: Icons.salary_icon,
    data: [
      { title: 'salaryReport' },
      { title: 'loanReport' },
      { title: 'pf_challan_report' },
      { title: 'tds_summary_report' },
    ],
  },
  { title: 'notes', icon: Icons.document },
  { title: 'emp_list', icon: Icons.Leave_attendance },
];
export const EmployeesFilter = [
  {
    status: true,
    name: 'All Notification',
    icon: Icons?.all_notification_icon,
    des: '',
    textColor: '',
    tintColor: Colors.secondary,
  },
  {
    status: true,
    name: 'attendance',
    icon: Icons?.attendance,
    des: '',
    textColor: '',
    tintColor: Colors.secondary,
  },
  {
    status: true,
    name: 'Announcemnet',
    icon: Icons?.announcement,
    des: '',
    textColor: '',
    tintColor: Colors.secondary,
  },
  {
    status: true,
    name: 'notes',
    icon: Icons?.notes_icon,
    des: '',
    textColor: '',
    tintColor: Colors.secondary,
  },
  {
    status: true,
    name: 'Leave Request',
    icon: Icons?.request_Leave,
    des: '',
    textColor: '',
    tintColor: Colors.secondary,
  },
  {
    status: true,
    name: 'Payment',
    icon: Icons?.payment_icon,
    des: '',
    textColor: '',
    tintColor: Colors.secondary,
  },
  {
    status: true,
    name: 'Live Track',
    icon: Icons?.live_track,
    des: '',
    textColor: '',
    tintColor: Colors.secondary,
  },
  {
    status: true,
    name: 'Message',
    icon: Icons?.message_icon,
    des: '',
    textColor: '',
    tintColor: Colors.secondary,
  },
  {
    status: true,
    name: 'System',
    icon: Icons?.system_icon,
    des: '',
    textColor: '',
    tintColor: Colors.secondary,
  },
];

export const otherText = {
  search: 'search',
  header: 'header',
  play: 'play',
  pause: 'pause',
  stop: 'stop',
  audio_recorder_player: 'audio_recorder_player',
  record: 'record',
  resume: 'resume',
  calender_with_inactive_days: 'calender_with_inactive_days',
  calender_with_custom_header_component:
    'calender_with_custom_header_component',
  next: 'next',
  custom_header: 'custom_header',
  previous: 'previous',
  calender_with_custom_header_title: 'calender_with_custom_header_title',
  calender_with_custom_day_component: 'calender_with_custom_day_component',
  custom_calender_with_custom_marking_type:
    'custom_calender_with_custom_marking_type',
  calender_with_multi_period_making: 'calender_with_multi_period_making',
  calender_with_selectable_date: 'calender_with_selectable_date',
  calender_with_week_numbers: 'calender_with_week_numbers',
  calender_with_min_max_date: 'calender_with_min_max_date',
  calender_with_marked_dates_hidden_rows:
    'calender_with_marked_dates_hidden_rows',
  calender_with_multi_dot_marking: 'calender_with_multi_dot_marking',
  calender_with_period_marking_spinner: 'calender_with_period_marking_spinner',
  calender_with_period_marking_dot_marking:
    'calender_with_period_marking_dot_marking',
  calender_multi_period_marking: 'calender_multi_period_marking',
  required: 'required',
  s_no: 's_no',
  name: 'name',
  serial_number: 'serial_number',
  edit: 'edit',
  add_biometric: 'add_biometric',
  bio_metric_information: 'bio_metric_information',
  status: 'status',
  active: 'active',
  inactive: 'inactive',
  update: 'update',
  submit: 'submit',
};

export const branchesText = {
  location_permission: 'location_permission',
  permission_message: 'permission_message',
  ok: 'ok',
  cancel: 'cancel',
  radius: 'radius',
  for: 'for',
  meter: 'meter',
  distance: 'distance',
  location: 'location',
  add_branch: 'add_branch',
  update_branch: 'update_branch',
  branch_info: 'branch_info',
  branch_name: 'branch_name',
  branch_location: 'branch_location',
};

export const employeelistText = {
  last_used: 'last_used',
  search_emp: 'search_emp',
  user_info: 'user_info',
  mobile: 'mobile',
  manager: 'manager',
  role: 'role',
  status: 'status',
  remark: 'remark',
  apply: 'apply',
};

export const leave_req_text = {
  date_created_by: 'date_created_by',
  start_day: 'start_day',
  end_day: 'end_day',
  total_day: 'total_day',
  subject: 'subject',
  leave: 'leave',
  description: 'description',
  updated_by: 'updated_by',
  on: 'on',
  days: 'days',
};

export const manage_attendance = {
  punch_in: 'punch_in',
  punch_out: 'punch_out',
  reset_attendance_message: `reset_attendance_message`,
  confirm: 'confirm',
  delete_account_message: 'delete_account_message',
  logout_message: 'Are you sure you want to logout?',
};

export const setting_text = {
  version: 'version',
  choose_lang: 'choose_lang',
};

export const report_text = {
  company_reports: 'company_reports',
  reports: 'reports',
  downloads: 'downloads',
  emp_list_report: 'emp_list_report',
  mar_24: 'mar_24',
  all_branches: 'all_branches',
  open: 'open',
  share: 'share',
  user_info: 'user_info',
  mobile_no: 'mobile_no',
  reporting_manager: 'reporting_manager',
  user_status: 'user_status',
  enter_remark: 'enter_remark',
};

export const notification_text = {
  select_notification_type: 'select_notification_type',
  all: 'all',
  select_all_emp: 'select_all_emp',
  select_staff: 'select_staff',
  employees: 'employees',
  filters: 'filters',
  yesterday: 'yesterday',
  today: 'today',
  earlier: 'earlier',
  notification_readed: 'notification_readed',
};

export const spashText = {
  oops_screen_text: 'oops_screen_text',
};

export const welcomeScreenText = {
  internal_server_error: 'internal_server_error',
  no_network_message: 'no_network_message',
  welcome_back: 'welcome_back',
};

export const aboutScreenText = {
  about_us: 'about_us',
};

export const alarmScreenText = {
  location_tracking: 'location_tracking',
  location_tracking_start: 'location_tracking_start',
  location_tracking_5mins: 'location_tracking_5mins',
};

export const todayNotesSreenText = {
  message: 'message',
  photos: 'photos',
  from_photos: 'from_photos',
  take_picture: 'take_picture',
};

export const adminHomeScreenText = {
  broadcast_message_send_success: 'broadcast_message_send_success',
  manage_attendance: 'manage_attendance',
  all_emp: 'all_emp',
  present: 'present',
  send_notification: 'send_notification',
  add_emp: 'add_emp',
  search_emp: 'search_emp',
  new_broadcast: 'new_broadcast',
  send_broadcast_to_all_emp: 'send_broadcast_to_all_emp',
  enter_title: 'enter_title',
  enter_message: 'enter_message',
  send_broadcast: 'send_broadcast',
  emp_name: 'emp_name',
  emp_detail: 'emp_detail',
  mob_number: 'mob_number',
  ref_name: 'ref_name',
  emp_cat: 'emp_cat',
  job_title: 'job_title',
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  bonus_yearly: 'bonus_yearly',
  emi_cycle: 'emi_cycle',
  secure_loan: 'secure_loan',
  unsecure_loan: 'unsecure_loan',
  loan_amt: 'loan_amt',
  inc_periods: 'inc_periods',
  diff_sal_amt: 'diff_sal_amt',
  to_be_paid_sal: 'to_be_paid_sal',
  actual_sal: 'actual_sal',
  less: 'less',
  excess: 'excess',
  hours_worked: 'hours_worked',
  working_hours: 'working_hours',
  role: 'role',
  branch: 'branch',
  attendance_within: 'attendance_within',
  anywhere: 'anywhere',
  time_slots: 'time_slots',
  date_of_joining: 'date_of_joining',
  from: 'from',
  to: 'to',
  payment_type: 'payment_type',
  monthly: 'monthly',
  daily: 'daily',
  hourly: 'hourly',
  salary_amount: 'salary_amount',
  salary_wage: 'salary_wage',
  hourly_wage: 'hourly_wage',
  mon: 'mon',
  tue: 'tue',
  wed: 'wed',
  thu: 'thu',
  fri: 'fri',
  sat: 'sat',
  sun: 'sun',
  designation: 'designation',
  emp_code: 'emp_code',
};

export const salaryScreenText = {
  salary: 'salary',
  user_details: 'user_details',
  attendance: 'attendance',
  notes: 'notes',
  salary_pending_march_24: 'salary_pending_march_24',
  calculate_salary: 'calculate_salary',
  pay_advance: 'pay_advance',
  basic_pay: 'basic_pay',
  total_working_days: 'total_working_days',
  hourly_salary: 'hourly_salary',
  overtime_pay: 'overtime_pay',
  allowance_pay: 'allowance_pay',
  deduction_pay: 'deduction_pay',
  loan_pay: 'loan_pay',
  bonus_wage: 'bonus_wage',
  download_report: 'download_report',
  live_tracker: 'live_tracker',
  show_in_map: 'show_in_map',
  type: 'type',
  date: 'date',
  no_payment_added: 'no_payment_added',
  payment_history: 'payment_history',
};

export const modalFormText = {
  modalForm: 'modalForm',
};

export const homeScreenTabText = {
  notification: 'notification',
  holidays_list: 'holidays_list',
  chat_us: 'chat_us',
  notes: 'notes',
  alarm: 'alarm',
};

export const bottomTabsText = {
  home: 'home',
  attendance: 'attendance',
  menu: 'menu',
};

export const adminHomeStackText = {
  notification: 'notification',
  manage_attendance: 'manage_attendance',
  branches: 'branches',
  emp_list: 'emp_list',
  leaveReq: 'leaveReq',
  reports: 'reports',
  biometric_device: 'biometric_device',
  sal_details: 'sal_details',
};

export const adminBottomStackText = {
  home: 'home',
  settings: 'settings',
};

export const leaveRequestScreenText = {
  leave_request: 'leave_request',
};
export const punchScreenText = {
  attendance_marked: 'attendance_marked',
  start_every10min: 'start_every10min',
  punching_in_at: 'punching_in_at',
  error: 'error',
  uninstall_mock_location_app: 'uninstall_mock_location_app',
  mock_location_message: 'mock_location_message',
  are_you_already_punched_in_out: 'are_you_already_punched_in_out',
  punch_out_at: 'punch_out_at',
  something_wrong: 'something_wrong',
  please_refresh: 'please_refresh',
  mark_attendance: 'mark_attendance',
  mark_your_attendance: 'mark_your_attendance',
  latitude: 'latitude',
  longitude: 'longitude',
  wait: 'wait',
  punch_out_caps: 'punch_out_caps',
  punch_in_now_caps: 'punch_in_now_caps',
};

export const profileText = {
  your_activity: 'your_activity',
};

export const posterScreenText = {
  edit: 'edit',
  share: 'share',
};

export const notesScreenText = {
  myNotes: 'myNotes',
};

export const myProfileText = {
  profile: 'profile',
  increament_period: 'increament_period',
  reference_name: 'reference_name',
  designation: 'designation',
  contract: 'contract',
  salarised: 'salarised',
  loading_unload: 'loading_unload',
  to_be_paid_sal: 'to_be_paid_sal',
  emergency_contact: 'emergency_contact',
  weekly_off: 'weekly_off',
  address: 'address',
};

export const menuScreenText = {
  logout_message: 'logout_message',
};

export const loginScreenText = {
  enter_phone_to_get_started: 'enter_phone_to_get_started',
  digit_code_sent_to: 'digit_code_sent_to',
  incorrect_otp: 'incorrect_otp',
  enter_4_digit_otp: 'enter_4_digit_otp',
  dont_get_otp: 'dont_get_otp',
  resend_otp: 'resend_otp',
  back: 'back',
  retry: 'retry',
  verify: 'verify',
  edit_number: 'edit_number',
  mobile_num: 'mobile_num',
  lets_go: 'lets_go',
};

export const holidayListText = {
  enter_text: 'enter_text',
  translation: 'translation',
  translate_it: 'translate_it',
  please_enter_valid_email_address: 'please_enter_valid_email_address',
  enquiry: 'enquiry',
  email: 'email',
  enquiry_feedback: 'enquiry_feedback',
};

export const documentScreenText = {
  doc_number: 'doc_number',
  back_img: 'back_img',
  front_img: 'front_img',
  add_doc: 'add_doc',
  docs: 'docs',
};

export const contactScreenText = {
  contact_us: 'contact_us',
  contact_us_at: 'contact_us_at',
};

export const chatScrenText = {
  ask_me_later: 'ask_me_later',
};

export const miniMapScreenText = {
  tell_us_company_address: 'tell_us_company_address',
  add_location: 'add_location',
};

export const customHeaderText = {
  welcome: 'welcome',
  check_latest_update: 'check_latest_update',
};

export const headerScreenText = {
  leave_taken: 'leave_taken',
  day_worked: 'day_worked',
  average_wh: 'average_wh',
};

export const customDocPickerScreenText = {
  upload_doc: 'upload_doc',
};

export const stackNames_Screen_Text = {
  attendance_leave_details: 'attendance_leave_details',
  posters: 'posters',
  my_profile: 'my_profile',
  request_leave: 'request_leave',
  holiday_list: 'holiday_list',
};

export const admin_stack_names_text = {
  contact: 'contact',
  branchs: 'branchs',
};
