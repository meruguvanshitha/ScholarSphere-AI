import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dataStore } from '../services/store';
import { generateToken } from '../middleware/auth';
import { DEMO_USERS_AND_PROFILES } from '../data/seedData';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Please provide a valid full name (minimum 2 characters).' });
      return;
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const assignedRole = role === 'admin' ? 'admin' : 'student';

    const existingUser = dataStore.findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const user = dataStore.createUser(name, email, password, assignedRole);
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    const profile = dataStore.getProfileByUserId(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = dataStore.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      return;
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    const profile = dataStore.getProfileByUserId(user._id);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const user = dataStore.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User record not found.' });
      return;
    }

    const profile = dataStore.getProfileByUserId(user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch current user.' });
  }
}

export async function demoLogin(req: Request, res: Response): Promise<void> {
  try {
    const { scenario } = req.body;
    let targetUserId = 'user_aarav_btech';

    if (scenario === 'alex_stem' || scenario === 'aarav_btech' || scenario === 'user_aarav_btech') {
      targetUserId = 'user_aarav_btech';
    } else if (scenario === 'maya_incomplete' || scenario === 'priya_incomplete' || scenario === 'user_priya_incomplete') {
      targetUserId = 'user_priya_incomplete';
    } else if (scenario === 'david_humanities' || scenario === 'rahul_humanities' || scenario === 'user_rahul_humanities') {
      targetUserId = 'user_rahul_humanities';
    } else if (scenario === 'admin_eleanor' || scenario === 'admin_ramanujam' || scenario === 'user_admin_ramanujam') {
      targetUserId = 'user_admin_ramanujam';
    }

    const user = dataStore.findUserById(targetUserId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Demo profile not found.' });
      return;
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    const profile = dataStore.getProfileByUserId(user._id);

    const demoInfo = DEMO_USERS_AND_PROFILES.find(d => d.user._id === targetUserId);

    res.json({
      success: true,
      message: `Signed in as demo user: ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile,
      scenarioDescription: demoInfo?.scenarioDescription
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Demo sign-in failed.' });
  }
}
