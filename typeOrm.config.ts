import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export default new DataSource({
	type: "mariadb",
	host: configService.get("DB_HOST"),
	port: configService.get("DB_PORT"),
	username: configService.get("DB_USER"),
	password: configService.get("DB_PASSWORD"),
	database: configService.get("DB_DATABASE"),
	entities: ["src/**/*.entity{.ts,.js}"],
	migrations: ["migrations/**/*{.ts,.js}"],
});
