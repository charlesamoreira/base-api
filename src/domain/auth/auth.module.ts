import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from "./service/auth.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "../../adapters/controller/auth.controller";
import { RefreshTokenFirebaseRepository } from "../../adapters/repository/refreshToken.repository";
import { TokenService } from "./service/token.service";

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get<string>("JWT_SECREAT"),
					signOptions: { expiresIn: configService.get<string>("JWT_EXPIRES") },
				};
			},
			inject: [ConfigService],
		}),
		PassportModule,
		UsersModule,
	],
	providers: [
		AuthService,
		TokenService,
		JwtStrategy,
		{
			provide: "RefreshTokenRepository",
			useClass: RefreshTokenFirebaseRepository,
		},
	],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
