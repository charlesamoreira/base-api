import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FirebaseModule } from "@nhogs/nestjs-firebase";
import { AuthModule } from "./domain/auth/auth.module";
import { UsersModule } from "./domain/users/users.module";

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		FirebaseModule.forRoot({
			apiKey: process.env.FIREBASE_apiKey,
			authDomain: process.env.FIREBASE_authDomain,
			projectId: process.env.FIREBASE_projectId,
			storageBucket: process.env.FIREBASE_storageBucket,
		}),
		UsersModule,
	],
	providers: [],
})
export class AppModule {}
