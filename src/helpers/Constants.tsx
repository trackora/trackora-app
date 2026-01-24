export const store_key_login_details = '@login';
export const store_key_intro_details = '@Intro';
export const store_key_location = '@location';
export const user_track_key = '@track';

export const login_get_otp = '/app/auth/request-otp';
export const login_with_otp = '/app/auth/login-otp';
export const logout_api = '/app/auth/logout';
export const attendance_start = '/app/attendance-start';
export const attendance_stop = '/app/attendance-stop';
export const profile_api = '/app/user/profile-detail';
export const home = '/app/home-data';
export const get_content_api = '/app/content-data';
export const delete_account_api = '/app/auth/delete-account';
export const submit_enquiry_api = '/app/enquiry/add';
export const update_profile_api = '/app/update_profile/profile_image'; // Need to check added /app to avoid 401 error and sudden logout
export const base64_to_file_api = '/app/base64-file';
export const attendance_list = '/app/attendance-list';
export const leave_add_api = '/app/leave-add';
export const delete_leave_api = '/app/leave-update/delete';
export const add_notes_api = '/app/notes/add';
export const notes_list_api = '/app/notes/list';
export const user_track_api = '/app/user/track-location';
export const getAttendanceDetails = '/app/attendance-home';

export const user_basic_details = '/app/user/detail'; // check
export const user_salary_details = '/app/user/salary-detail';

// Holiday List Module
export const holidayList = '/app/holiday-list';
export const addHolidayApi = '/app/holiday-add';
export const updateHoliday = '/app/holiday-update/status';

// notification

export const notification_list_api = '/app/notification/list';
export const notification_type_api = '/app/notification/type';
export const get_unread_notification_count_api =
  '/app/notification/unread/count';
export const mark_read_notification_api = '/app/notification/read';
export const update_fcm_api = '/app/update-fcm';


// device module

export const getAllDeviceApi = "/app/device-list"
export const approveDeviceApi = "/app/device/update-status"
export const addDeviceApi = "/app/device-add"

// shift module
export const shiftList = '/app/shift-list';
export const addShift = '/app/shift-add';
export const updateShift = '/app/shift-update';
export const deleteShift = '/app/shift-delete';

// break module
export const breakList = '/app/break-list';
export const addBreak = '/app/break-add';
export const updateBreak = '/app/break-update';
export const deleteBreak = '/app/break-delete';

// menu data

export const menu_api = '/app/menu-data';
//chat
export const chat_list_api = '/app/chat/list';
export const chat_send_api = '/app/chat/send';
export const poster_type_api = 'master/poster/type';
export const doc_type_list_api = '/app/user/document-type';
export const document_detail_api = '/app/user/document-detail';
export const update_profile_document_api = 'update_profile/document';

//admin
export const attendance_v2_list_api = 'attendance_v2/list';
export const send_notification_api = 'send_notification';
export const user_list_api = '/app/employee-list';
export const add_user_api = 'user/add';
export const role_list_api = 'user/role_list';
export const sfa_admin_home_api = 'sfa/home';
export const attendance_restart_api = 'attendance/restart';
export const user_status_list_api = 'user/status_list';
export const update_user_status_api = 'user/update_status';
export const leave_list_count_api = '/app/leave-list/count';
export const leave_list_api = '/app/leave-list';
export const leave_type = '/app/leave-type';
export const category_list_api = 'user/category_list';
export const attendance_list_excel_api = 'attendance/list/excel';
export const attendance_list_pdf_api = 'salary_user/attendance/pdf';

// Biometric
export const biometric_list_api = 'biometric/list';
export const biometric_add_api = 'biometric/add';
export const biometric_update_api = 'biometric/update';

// branch
export const branch_list_api = '/app/branch/list';
export const add_branch_api = '/app/branch/add ';
export const update_branch_api = '/app/branch/update';

//leave
export const update_leave_status_api = 'leave/update_status';

// add form
