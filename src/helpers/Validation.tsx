export function checkPhoneNumber(inputtxt) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneno.test(inputtxt);
}

export function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
}
export function validateNotEmpty(input) {
  return /\S/.test(input);
}

/** Utility to safely check API success */

export const isApiSuccess = response => {
  if (!response || typeof response !== 'object') return false;
  const status = response?.data?.status;
  if (typeof status === 'string')
    return status.trim().toLowerCase() === 'success';
  if (response?.data?.success === true) return true;
  return false;
};
