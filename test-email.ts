import { sendVerificationEmail, sendPasswordResetEmail } from './server/email-service.js';

// Mock user for verification email
const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'user@example.com',
  verificationToken: 'abc123verification'
};

// Test verification email
console.log('\n\n========== TESTING VERIFICATION EMAIL ==========\n');
sendVerificationEmail(mockUser)
  .then(result => {
    console.log(`Email sent successfully: ${result}`);
  })
  .catch(error => {
    console.error('Error sending verification email:', error);
  });

// Test password reset email
console.log('\n\n========== TESTING PASSWORD RESET EMAIL ==========\n');
sendPasswordResetEmail('user@example.com', 'xyz789reset')
  .then(result => {
    console.log(`Email sent successfully: ${result}`);
  })
  .catch(error => {
    console.error('Error sending password reset email:', error);
  });
