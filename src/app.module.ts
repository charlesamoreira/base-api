import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { AuthModule } from "./domain/auth/auth.module";
import { UserModule } from "./domain/user/user.module";

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MailerModule.forRoot({
			transport: {
				host: process.env.MAIL_HOST,
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PASS,
				},
				tls: {
					rejectUnauthorized: false,
				},
			},
			defaults: {
				from: "\"Suporte\" <suporte@baseapi.app.br>",
			},
			template: {
				dir: join(__dirname, "../templates/mail"),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}),
		TypeOrmModule.forRoot({
			type: "mariadb",
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			autoLoadEntities: true,
			synchronize: false,
			logging: Boolean(process.env.TYPEORM_DEBUG),
		}),
		UserModule,
	],
	providers: [],
})
export class AppModule {}
