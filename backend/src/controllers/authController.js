import { loginUser } from '../services/authService.js';
import { setAuthCookie, clearAuthCookie } from '../utils/jwtUtils.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
};
