import validator from 'validator';

export const validateEmail = email => validator.isEmail(email);

export const validatePassword = password => /^[a-zA-Z0-9_]{4,16}$/.test(password);