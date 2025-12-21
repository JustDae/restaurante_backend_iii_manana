import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string | null> {
    try {
      const user: User | null = await this.usersService.findByUsername(
        loginDto.username,
      );
      if (!user) return null;

      const isValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isValid) return null;

      const payload = {
        sub: user.id,
        id: user.id,
        username: user.username,
        rolId: user.rol?.id,
      };

      return this.jwtService.sign(payload);
    } catch (err) {
      console.error('Unexpected login error:', err);
      return null;
    }
  }

  async register(createUserDto: CreateUserDto): Promise<string | null> {
    const datosUsuario = {
      ...createUserDto,
      rolId: createUserDto.rolId || 4,
    };

    const user = await this.usersService.create(datosUsuario);

    if (!user) return null;

    const payload = {
      sub: user.id,
      id: user.id,
      username: user.username,
      rolId: user.rol?.id,
    };

    return this.jwtService.sign(payload);
  }
}
