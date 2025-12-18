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

      // MEJORA: Agregamos 'sub' y el 'rolId' al token
      const payload = {
        sub: user.id, // Estándar JWT
        id: user.id, // Por comodidad
        username: user.username,
        rolId: user.rol?.id, // Importante para saber permisos en el Front
      };

      return this.jwtService.sign(payload);
    } catch (err) {
      console.error('Unexpected login error:', err);
      return null;
    }
  }

  async register(createUserDto: CreateUserDto): Promise<string | null> {
    // Asegúrate de que el Rol con ID 4 exista en tu base de datos
    const roleIdPorDefecto = 4;

    // Unimos los datos
    const datosUsuario = {
      ...createUserDto,
      rolId: roleIdPorDefecto,
    };

    // TypeScript a veces se queja aquí si CreateUserDto no tiene rolId definido.
    // Si te da error, usa: (datosUsuario as any)
    const user = await this.usersService.create(datosUsuario);

    if (!user) return null;

    // MEJORA: El payload debe ser IGUAL al del login
    const payload = {
      sub: user.id,
      id: user.id,
      username: user.username,
      rolId: user.rol?.id || roleIdPorDefecto, // Usamos el del objeto o el defecto
    };

    return this.jwtService.sign(payload);
  }
}
