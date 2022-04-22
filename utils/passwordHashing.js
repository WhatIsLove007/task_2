import bcrypt from 'bcrypt';

export const hash = async password => await bcrypt.hash(password, 10);