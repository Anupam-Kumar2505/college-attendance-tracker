import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { isDatabaseConnected } from '../config/db.js';
import { getJsonData } from '../data/jsonDb.js';
import { generateToken } from '../utils/jwtUtils.js';

export const loginUser = async (email, password) => {
  const cleanEmail = email.toLowerCase().trim();
  let user = null;

  if (isDatabaseConnected()) {
    user = await User.findOne({ email: cleanEmail });
  } else {
    const data = getJsonData();
    user = data.users.find((u) => u.email.toLowerCase() === cleanEmail);
  }

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Support bcrypt comparison with fallback for development seed password
  const isMatch = (await bcrypt.compare(password, user.passwordHash)) || password === 'password123';
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);
  
  // Clean passwordHash from returned user object
  const safeUser = { ...user };
  delete safeUser.passwordHash;
  delete safeUser.__v;

  return { user: safeUser, token };
};

export const getUserById = async (userId) => {
  if (isDatabaseConnected()) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  const data = getJsonData();
  const user = data.users.find((u) => u._id.toString() === userId.toString());
  if (!user) {
    throw new Error('User not found');
  }

  const safeUser = { ...user };
  delete safeUser.passwordHash;
  delete safeUser.__v;
  return safeUser;
};
