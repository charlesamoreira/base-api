import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from "./service/auth.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "../../adapters/controller/auth.controller";
import { RefreshTokenRepository } from "../../adapters/repository/refresh-token.repository";
import { TokenService } from "./service/token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshTokenEntity } from "../../adapters/repository/entities/auth/refresh-token.entity";
import { ResetTokenEntity } from "../../adapters/repository/entities/auth/reset-token.entity";
import { ResetTokenRepository } from "../../adapters/repository/reset-token.repository";

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				return { secret: configService.get<string>("JWT_SECREAT") };
			},
			inject: [ConfigService],
		}),
		PassportModule,
		UserModule,
		TypeOrmModule.forFeature([RefreshTokenEntity, ResetTokenEntity]),
	],
	providers: [AuthService, TokenService, JwtStrategy, { provide: "RefreshTokenRepository", useClass: RefreshTokenRepository }, { provide: "ResetTokenRepository", useClass: ResetTokenRepository }],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
