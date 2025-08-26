import {DEPARTMENT, POSITIONS} from '../../constants';
import {
  NAME_INPUT_REGEX,
  PHONE_INPUT_NUMBER_REGEX,
  EMAIL_INPUT_REGEX,
} from './employeeEditor.constants';

export const formatDate = (date, delimiter) => {
  if (delimiter === '/') {
    const [day, month, year] = date.split(delimiter);
    return `${year}-${month}-${day}`;
  }
  const [year, month, day] = date.split(delimiter);
  return `${day}/${month}/${year}`;
};

/* This function will fail for too fast insertions but since this is a demo project I kept using it
   Instead of crypto.randomUUID(); since all browsers do not support it yet and it would need a polyfill
   and also i didn't want to add any extra dependencies */
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
};

// TODO: Might carry these to constants file
export const departmentInputErrorHandler = {
  handle: (value) => ![DEPARTMENT.ANALYTICS, DEPARTMENT.TECH].includes(value),
  message: 'Department name can be Analytics or Tech',
};

export const positionInputErrorHandler = {
  handle: (value) =>
    ![POSITIONS.JUNIOR, POSITIONS.MEDIOR, POSITIONS.SENIOR].includes(value),
  message: 'Position name must be selected',
};

export const phoneInputErrorHandler = {
  handle: (value) => !PHONE_INPUT_NUMBER_REGEX.test(value),
  message: 'Please enter a valid phone number',
};

export const emailInputErrorHandler = {
  handle: (value) => !EMAIL_INPUT_REGEX.test(value),
  message: 'Please enter a valid email address',
};

export const nameInputErrorHandler = {
  handle: (value) => !NAME_INPUT_REGEX.test(value),
  message: 'Please enter a valid name',
};

export const lastNameInputErrorHandler = {
  handle: (value) => !NAME_INPUT_REGEX.test(value),
  message: 'Please enter a valid last name',
};
