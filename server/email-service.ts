import { User } from '@shared/schema';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Base URL for application links
 * In production, this would be your domain
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * Currently uses console logging for development
 * Can be replaced with actual email service later
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    console.log('========== EMAIL SENT ==========');
    console.log(`TO: ${options.to}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log('TEXT:');
    console.log(options.text);
    console.log('HTML:');
    console.log(options.html);
    console.log('===============================');
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(user: User): Promise<boolean> {
  if (!user.email || !user.verificationToken) {
    console.error('Cannot send verification email: Missing email or token');
    return false;
  }
  
  const verificationLink = `${BASE_URL}/verify-email/${user.verificationToken}`;
  
  return sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    text: `
      Welcome to the platform!
      
      Please verify your email address by clicking the link below:
      
      ${verificationLink}
      
      This link will expire in 24 hours.
      
      If you did not sign up for an account, you can ignore this email.
    `,
    html: `
      <h2>Welcome to the platform!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <p>
        <a href="${verificationLink}" style="padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
      </p>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${verificationLink}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not sign up for an account, you can ignore this email.</p>
    `
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetLink = `${BASE_URL}/reset-password/${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset your password',
    text: `
      You requested to reset your password.
      
      Please click the link below to set a new password:
      
      ${resetLink}
      
      This link will expire in 1 hour.
      
      If you did not request a password reset, you can ignore this email.
    `,
    html: `
      <h2>Reset your password</h2>
      <p>You requested to reset your password.</p>
      <p>Please click the button below to set a new password:</p>
      <p>
        <a href="${resetLink}" style="padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${resetLink}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, you can ignore this email.</p>
    `
  });
}
