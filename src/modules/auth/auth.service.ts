import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import { query } from '../../config/database';
import { ENV } from '../../config/env';
import { AuthResponse, AuthUser, JwtPayload, LoginRequest, RegisterRequest } from './auth.model';

interface QueryResult {
  insertId: number;
}

export class AuthService {
  private readonly saltRounds = 12;
  private readonly jwtSecret = ENV.JWT_SECRET || 'your-secret-key';
  private readonly jwtExpiresIn = '24h';

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);

    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, email, password, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;

    const result = await query<QueryResult>(insertQuery, [
      userData.name,
      userData.email,
      hashedPassword,
    ]);

    const userId = result.insertId;

    // Get the created user
    const newUser = await this.findUserById(userId);
    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // Generate JWT token
    const token = this.generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    };
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    // Find user by email
    const user = await this.findUserByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async findUserByEmail(email: string): Promise<AuthUser | null> {
    const selectQuery = 'SELECT * FROM users WHERE email = ?';
    const rows = await query<RowDataPacket[]>(selectQuery, [email]);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0] as AuthUser;
  }

  async findUserById(id: number): Promise<AuthUser | null> {
    const selectQuery = 'SELECT * FROM users WHERE id = ?';
    const rows = await query<RowDataPacket[]>(selectQuery, [id]);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0] as AuthUser;
  }

  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }
}

export default new AuthService();
