function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isProfileComplete(user) {
  if (!user) return false;
  if (user.profileComplete === true) return true;

  return (
    hasText(user.phoneNumber) &&
    hasText(user.emergencyContactName) &&
    hasText(user.emergencyContactPhone) &&
    user.height != null &&
    user.weight != null
  );
}
