/**
 * User Repository - Data Access Layer for User entity
 */

import { eq, or } from 'drizzle-orm';
import { getDB } from '../config/database';
import { users } from '../db/schema';
import { IUser, IUserCreateInput, IUserUpdateInput } from '../types/user.types';
import { BaseRepository } from './IRepository';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

type DbError = Error & {
  detail?: string;
  code?: string;
  cause?: DbError;
};

export class UserRepository extends BaseRepository<IUser, IUserCreateInput, IUserUpdateInput> {
  /**
   * Get database instance
   */
  private getDb() {
    return getDB();
  }

  /**
   * Create a new user
   */
  async create(data: IUserCreateInput): Promise<IUser> {
    const db = this.getDb();
    const normalizedUsername = data.username.toLowerCase().trim();
    const normalizedEmail = data.email?.toLowerCase().trim();
    const normalizedPhone = data.phone?.trim();

    const duplicateUser = await db.query.users.findFirst({
      where: normalizedEmail && normalizedPhone
        ? or(
            eq(users.username, normalizedUsername),
            or(eq(users.email, normalizedEmail), eq(users.phone, normalizedPhone))
          )
        : normalizedEmail
          ? or(eq(users.username, normalizedUsername), eq(users.email, normalizedEmail))
          : normalizedPhone
            ? or(eq(users.username, normalizedUsername), eq(users.phone, normalizedPhone))
            : eq(users.username, normalizedUsername)
    });

    if (duplicateUser) {
      const duplicateError = new Error('User already exists') as Error & { code?: string };
      duplicateError.code = 'USER_EXISTS';
      throw duplicateError;
    }

    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Insert user
      const [user] = await db
        .insert(users)
        .values({
          id: randomUUID(),
          username: normalizedUsername,
          email: normalizedEmail || '',
          phone: normalizedPhone,
          password: hashedPassword,
          fullName: data.fullName?.trim(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      return user as IUser;
    } catch (error) {
      const dbError = error as DbError;
      const pgError = (dbError.cause as DbError | undefined) || dbError;
      console.error('UserRepository.create insert failed', {
        message: pgError.message,
        detail: pgError.detail,
        code: pgError.code
      });

      if (pgError.code === '23505') {
        const duplicateError = new Error('User already exists') as Error & { code?: string };
        duplicateError.code = 'USER_EXISTS';
        throw duplicateError;
      }

      const createError = new Error('Failed to create user') as Error & { code?: string };
      createError.code = 'USER_CREATE_FAILED';
      throw createError;
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    try {
      const db = this.getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.id, id)
      });
      return (user as IUser) || null;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error}`);
    }
  }

  /**
   * Find all users with pagination
   */
  async findAll(options?: { limit?: number; offset?: number }): Promise<IUser[]> {
    try {
      const db = this.getDb();
      const result = await db.query.users.findMany({
        limit: options?.limit || 10,
        offset: options?.offset || 0
      });
      return result as IUser[];
    } catch (error) {
      throw new Error(`Failed to find users: ${error}`);
    }
  }

  /**
   * Update user
   */
  async update(id: string, data: Partial<IUserUpdateInput>): Promise<IUser | null> {
    try {
      const db = this.getDb();
      const [updatedUser] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();

      return (updatedUser as IUser) || null;
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<boolean> {
    try {
      const db = this.getDb();
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error}`);
    }
  }

  /**
   * Find user by condition
   */
  async findOne(condition: Record<string, unknown>): Promise<IUser | null> {
    try {
      const db = this.getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.username, condition.username as string)
      });
      return (user as IUser) || null;
    } catch (error) {
      throw new Error(`Failed to find user: ${error}`);
    }
  }

  /**
   * Find many users by condition
   */
  async findMany(condition: Record<string, unknown>): Promise<IUser[]> {
    try {
      const db = this.getDb();
      const results = await db.query.users.findMany({
        where: eq(users.isOnline, condition.isOnline as boolean)
      });
      return results as IUser[];
    } catch (error) {
      throw new Error(`Failed to find users: ${error}`);
    }
  }

  /**
   * Check if user exists
   */
  async exists(condition: Record<string, unknown>): Promise<boolean> {
    try {
      const db = this.getDb();
      const user = await db.query.users.findFirst({
        where: or(
          eq(users.username, condition.username as string),
          eq(users.email, condition.email as string)
        )
      });
      return !!user;
    } catch (error) {
      throw new Error(`Failed to check user existence: ${error}`);
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const db = this.getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase())
      });
      return (user as IUser) || null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error}`);
    }
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<IUser | null> {
    try {
      const db = this.getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.username, username.toLowerCase())
      });
      return (user as IUser) || null;
    } catch (error) {
      throw new Error(`Failed to find user by username: ${error}`);
    }
  }

  /**
   * Find user by email or username
   */
  async findByEmailOrUsername(
    email: string | undefined,
    username: string,
    phone?: string
  ): Promise<IUser | null> {
    try {
      const db = this.getDb();
      const normalizedUsername = username.toLowerCase().trim();
      const normalizedEmail = email?.toLowerCase().trim();
      const normalizedPhone = phone?.trim();

      const user = await db.query.users.findFirst({
        where: normalizedEmail && normalizedPhone
          ? or(
              eq(users.username, normalizedUsername),
              or(eq(users.email, normalizedEmail), eq(users.phone, normalizedPhone))
            )
          : normalizedEmail
            ? or(eq(users.username, normalizedUsername), eq(users.email, normalizedEmail))
            : normalizedPhone
              ? or(eq(users.username, normalizedUsername), eq(users.phone, normalizedPhone))
              : eq(users.username, normalizedUsername)
      });
      return (user as IUser) || null;
    } catch (error) {
      throw new Error(`Failed to find user: ${error}`);
    }
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
