import { JwtService } from '@nestjs/jwt';
import {
  UserRole,
} from '../users/schemas/user.schema';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
  private readonly usersService: UsersService,
  private readonly jwtService: JwtService,
) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.usersService.createUser(
      name,
      email,
      passwordHash,
      UserRole.EMPLOYEE,
    );

    return {
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(loginDto: LoginDto) {
  const user = await this.usersService.findByEmail(loginDto.email);

  if (!user || !user.isActive) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const passwordMatches = await bcrypt.compare(
    loginDto.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const accessToken = await this.jwtService.signAsync({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    message: 'Login successful',
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
}