import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "../../adapters/controller/users.controller";
import { UserService } from "./service/user.service";
import { UserEntity } from "../../adapters/repository/entities/user/user.entity";
import { UserRepository } from "../../adapters/repository/user.repository";

@Module({
	controllers: [UsersController],
	exports: [UserService],
	imports: [ TypeOrmModule.forFeature([UserEntity])],
	providers: [UserService, { provide: "UserRepository", useClass: UserRepository }],
})
export class UserModule {}
