import crypto from 'crypto';
import { db } from './db';
import { users, userDevices, mfaBackupCodes, securityEvents, userSessions } from '@shared/schema';
import { eq, and, lt, gt } from 'drizzle-orm';

/**
 * Multi-Factor Authentication Service
 * Provides functions for TOTP-based second-factor authentication
 */
export class MfaService {
  /**
   * Generate a new TOTP secret for a user
   */
  async generateSecret(userId: number): Promise<string> {
    // Generate a cryptographically secure random string for the secret
    const secret = crypto.randomBytes(20).toString('hex');
    
    // Update user record with the new secret
    await db.update(users)
      .set({ mfaSecret: secret, lastSecurityUpdate: new Date() })
      .where(eq(users.id, userId));
      
    return secret;
  }
  
  /**
   * Generate a set of recovery codes for a user
   * @param userId - The user ID
   * @param count - Number of recovery codes to generate (default: 10)
   */
  async generateRecoveryCodes(userId: number, count: number = 10): Promise<string[]> {
    // First, clear any existing recovery codes
    await db.delete(mfaBackupCodes)
      .where(eq(mfaBackupCodes.userId, userId));
    
    const codes: string[] = [];
    
    // Generate random recovery codes
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(5).toString('hex').toUpperCase();
      codes.push(code);
      
      // Insert the recovery code into the database
      await db.insert(mfaBackupCodes)
        .values({
          userId,
          code: code,
          isUsed: false,
        });
    }
    
    return codes;
  }
  
  /**
   * Enable MFA for a user
   * @param userId - The user ID
   */
  async enableMfa(userId: number): Promise<void> {
    await db.update(users)
      .set({ 
        mfaEnabled: true,
        lastSecurityUpdate: new Date() 
      })
      .where(eq(users.id, userId));
    
    // Log security event
    await this.logSecurityEvent(userId, 'MFA_ENABLED', 'Multi-factor authentication was enabled');
  }
  
  /**
   * Disable MFA for a user
   * @param userId - The user ID
   */
  async disableMfa(userId: number): Promise<void> {
    await db.update(users)
      .set({ 
        mfaEnabled: false,
        mfaSecret: null,
        lastSecurityUpdate: new Date() 
      })
      .where(eq(users.id, userId));
      
    // Clear recovery codes
    await db.delete(mfaBackupCodes)
      .where(eq(mfaBackupCodes.userId, userId));
    
    // Log security event
    await this.logSecurityEvent(userId, 'MFA_DISABLED', 'Multi-factor authentication was disabled');
  }
  
  /**
   * Validate a TOTP code
   * @param userId - The user ID
   * @param code - The TOTP code to validate
   */
  async validateTotpCode(userId: number, code: string): Promise<boolean> {
    // Fetch the user's MFA secret
    const [user] = await db.select({ mfaSecret: users.mfaSecret })
      .from(users)
      .where(eq(users.id, userId));
      
    if (!user || !user.mfaSecret) {
      return false;
    }

    // A custom TOTP implementation since we're not able to use external libraries
    // In a real implementation, this would use a proper TOTP algorithm
    // This is a simplified version for demonstration purposes
    const currentTimeSlice = Math.floor(Date.now() / 30000); // 30-second window
    const expectedCode = this.generateTotpCode(user.mfaSecret, currentTimeSlice);
    
    // Allow for slight time drift by checking adjacent time windows
    const prevCode = this.generateTotpCode(user.mfaSecret, currentTimeSlice - 1);
    const nextCode = this.generateTotpCode(user.mfaSecret, currentTimeSlice + 1);
    
    return code === expectedCode || code === prevCode || code === nextCode;
  }
  
  /**
   * Validate a backup recovery code
   * @param userId - The user ID
   * @param code - The recovery code to validate
   */
  async validateRecoveryCode(userId: number, code: string): Promise<boolean> {
    // Find the recovery code
    const [backupCode] = await db.select()
      .from(mfaBackupCodes)
      .where(
        and(
          eq(mfaBackupCodes.userId, userId),
          eq(mfaBackupCodes.code, code),
          eq(mfaBackupCodes.isUsed, false)
        )
      );
      
    if (!backupCode) {
      return false;
    }
    
    // Mark the recovery code as used
    await db.update(mfaBackupCodes)
      .set({ isUsed: true, usedAt: new Date() })
      .where(eq(mfaBackupCodes.id, backupCode.id));
    
    // Log security event
    await this.logSecurityEvent(userId, 'RECOVERY_CODE_USED', 'A recovery code was used for authentication');
    
    return true;
  }
  
  /**
   * Generate a TOTP code given a secret and time slice
   * @param secret - The secret key
   * @param timeSlice - Current time slice
   */
  private generateTotpCode(secret: string, timeSlice: number): string {
    const hmac = crypto.createHmac('sha1', secret);
    hmac.update(Buffer.from(timeSlice.toString()).toString('hex'));
    const hmacResult = hmac.digest('hex');
    
    // Get the offset
    const offset = parseInt(hmacResult.charAt(hmacResult.length - 1), 16);
    
    // Generate 6-digit code
    const code = (parseInt(hmacResult.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff) % 1000000;
    return code.toString().padStart(6, '0');
  }
  
  /**
   * Log a security event
   */
  async logSecurityEvent(
    userId: number | null, 
    eventType: string, 
    eventDescription: string, 
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await db.insert(securityEvents)
      .values({
        userId,
        eventType,
        eventDescription,
        metadata,
        createdAt: new Date()
      });
  }
}

export const mfaService = new MfaService();
