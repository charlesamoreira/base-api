import { Module } from "@nestjs/common";
import { FirebaseModule } from "@nhogs/nestjs-firebase";
import { UsersController } from "../../adapters/controller/users.controller";
import { UsersFirebaseRepository } from "../../adapters/repository/users.repository";
import { UsersService } from "./users.service";

@Module({
	controllers: [UsersController],
	exports: [UsersService],
	imports: [FirebaseModule],
	providers: [UsersService, { provide: "UsersRepository", useClass: UsersFirebaseRepository }],
})
export class UsersModule {}
