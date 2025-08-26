// Simple validators and Vietnamese name normalization (BEM not applicable)

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").toLowerCase());
}

export function isStrongPassword(value) {
  return typeof value === "string" && value.length >= 8;
}

export function normalizeVietnameseName(input) {
  if (!input) return "";
  const lower = String(input).toLowerCase().normalize("NFC");
  const parts = lower
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  return parts.join(" ");
}

function isValidDateParts(day, month, year) {
  const d = Number(day), m = Number(month), y = Number(year);
  if (!d || !m || !y) return false;
  if (y < 1900 || y > new Date().getFullYear()) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function validateRegister(values) {
  const errors = {};
  if (!values.fullName) errors.fullName = "Vui lòng nhập họ và tên";
  if (values.fullName && normalizeVietnameseName(values.fullName).length < 3)
    errors.fullName = "Họ và tên không hợp lệ";

  if (!values.email) errors.email = "Vui lòng nhập email";
  else if (!isValidEmail(values.email)) errors.email = "Email không hợp lệ";

  if (!values.phone) errors.phone = "Vui lòng nhập số điện thoại";

  // Validate gender (radio)
  if (!values.gender) errors.gender = "Vui lòng chọn giới tính";

  // Validate DOB from day/month/year selectors
  if (!isValidDateParts(values.day, values.month, values.year)) {
    errors.dateOfBirth = "Ngày sinh không hợp lệ";
  }

  if (!values.password) errors.password = "Vui lòng nhập mật khẩu";
  else if (!isStrongPassword(values.password)) errors.password = "Mật khẩu tối thiểu 8 ký tự";

  if (!values.confirmPassword) errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  else if (values.password !== values.confirmPassword) errors.confirmPassword = "Mật khẩu không khớp";

  if (!values.otp || values.otp.length !== 6) errors.otp = "OTP gồm 6 chữ số";
  return errors;
}

export function validateLogin(values) {
  const errors = {};
  if (!values.email) errors.email = "Vui lòng nhập email";
  else if (!isValidEmail(values.email)) errors.email = "Email không hợp lệ";
  if (!values.password) errors.password = "Vui lòng nhập mật khẩu";
  return errors;
}

export function validateReset(values) {
  const errors = {};
  if (!values.email) errors.email = "Vui lòng nhập email";
  else if (!isValidEmail(values.email)) errors.email = "Email không hợp lệ";
  if (!values.otp || values.otp.length !== 6) errors.otp = "OTP gồm 6 chữ số";
  if (!values.newPassword) errors.newPassword = "Vui lòng nhập mật khẩu mới";
  else if (!isStrongPassword(values.newPassword)) errors.newPassword = "Mật khẩu tối thiểu 8 ký tự";
  if (!values.confirmPassword) errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  else if (values.newPassword !== values.confirmPassword) errors.confirmPassword = "Mật khẩu không khớp";
  return errors;
}


