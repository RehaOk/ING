export const getTableTitles = (labels) => {
  const {
    firstName,
    lastName,
    dateOfEmployment,
    dateOfBirth,
    phone,
    email,
    department,
    position,
    actions,
  } = labels;
  return [
    firstName,
    lastName,
    dateOfEmployment,
    dateOfBirth,
    phone,
    email,
    department,
    position,
    actions,
  ];
};
