import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../config/firebase';

// Custom error class for admin-related errors
export class AdminError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AdminError';
  }
}

// Interface for admin data stored in Firestore
export interface AdminData {
  email: string;
  role: 'admin' | 'superadmin';
  createdAt: typeof serverTimestamp;
  lastLogin?: typeof serverTimestamp | null;
  isActive: boolean;
}

// Simulated allowed admin emails (replace with Firestore collection if needed)
// const ALLOWED_ADMIN_EMAILS = ['superadmin@rptrakebonmelati.id', 'admin@example.com'];

/**
 * Check if email is in allowed admin list
 * @param email - User's email from Firebase Authentication
 */
export const isAllowedAdminEmail = async (email: string): Promise<boolean> => {
  try {
    const allowedDoc = await getDoc(doc(db, 'allowedAdmins', email.toLowerCase()));
    return allowedDoc.exists();
  } catch (error) {
    console.error('Error checking allowed email:', error);
    return false;
  }
};

/**
 * Check if user is an active admin in Firestore
 * @param userId - Firebase Authentication user ID
 */
export const checkUserIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    const adminDocRef = doc(db, 'admins', userId);
    const adminDoc = await getDoc(adminDocRef);
    if (adminDoc.exists()) {
      const adminData = adminDoc.data() as AdminData;
      return adminData.isActive === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new AdminError('Failed to check admin status', 'CHECK_ADMIN_FAILED');
  }
};

/**
 * Get admin data from Firestore
 * @param userId - Firebase Authentication user ID
 */
export const getAdminData = async (userId: string): Promise<AdminData | null> => {
  try {
    const adminDocRef = doc(db, 'admins', userId);
    const adminDoc = await getDoc(adminDocRef);
    if (adminDoc.exists()) {
      return adminDoc.data() as AdminData;
    }
    return null;
  } catch (error) {
    console.error('Error getting admin data:', error);
    throw new AdminError('Failed to retrieve admin data', 'GET_ADMIN_DATA_FAILED');
  }
};

/**
 * Create or update admin record in Firestore using Firebase Authentication data
 * @param user - Firebase Authentication User object
 * @param isLogin - Whether this is a login event (to update lastLogin)
 */
export const createOrUpdateAdminRecord = async (
  user: User,
  isLogin: boolean = false
): Promise<void> => {
  if (!user.email) {
    throw new AdminError('User email is missing', 'MISSING_EMAIL');
  }

  try {
    const adminRef = doc(db, 'admins', user.uid);
    const adminDoc = await getDoc(adminRef);

    const role: 'admin' | 'superadmin' =
      user.email.toLowerCase() === 'superadmin@rptrakebonmelati.id' ? 'superadmin' : 'admin';

    if (adminDoc.exists()) {
      // Update existing admin record
      if (isLogin) {
        await setDoc(
          adminRef,
          {
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } else {
      // Create new admin record
      await setDoc(adminRef, {
        email: user.email.toLowerCase(),
        role,
        createdAt: serverTimestamp(),
        lastLogin: isLogin ? serverTimestamp() : null,
        isActive: true,
      });
    }
  } catch (error) {
    console.error('Error creating/updating admin record:', error);
    throw new AdminError('Failed to create/update admin record', 'ADMIN_RECORD_FAILED');
  }
};