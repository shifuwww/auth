import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserAtJwtInterface } from 'src/shared/interfaces';

@Injectable()
export class JwtService {
  constructor(
    private readonly _jwtService: NestJwtService,
    private readonly _configService: ConfigService,
  ) {}

  public verifyAtJwtToken(token: string) {
    return this._jwtService.verifyAsync(token, {
      secret: this._configService.get('JWT_ACCESS_SECRET'),
    });
  }

  public verifyRtJwtToken(token: string) {
    return this._jwtService.verifyAsync(token, {
      secret: this._configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async createJwtToken(payload: UserAtJwtInterface) {
    const [accessToken, refreshToken] = await Promise.all([
      this._createAccessToken(payload),
      this._createRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async _createAccessToken(payload: UserAtJwtInterface) {
    return this._jwtService.signAsync(payload, {
      secret: this._configService.get('JWT_ACCESS_SECRET'),
      expiresIn: `${this._configService.get('JWT_ACCESS_TOKEN_TTL')}s`,
    });
  }

  private async _createRefreshToken(payload: UserAtJwtInterface) {
    return this._jwtService.signAsync(payload, {
      secret: this._configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this._configService.get('JWT_REFRESH_TOKEN_TTL')}s`,
    });
  }
}
