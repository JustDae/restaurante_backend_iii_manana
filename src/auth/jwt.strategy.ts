import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service'; // 👈 Asegúrate de que la ruta sea correcta

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService, // 👈 DEBES AGREGAR ESTO AQUÍ
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    // Buscamos al usuario en la BD para tener el objeto completo con su Rol
    const user = await this.usersService.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado o token inválido');
    }

    // Retornamos el usuario completo.
    // Ahora req.user tendrá la propiedad .rol que el RolesGuard necesita.
    return user;
  }
}
