import { NestFactory } from "@nestjs/core";
import supertest from "supertest";
import { INestApplication } from "@nestjs/common/interfaces/nest-application.interface";
import { ExpressAdapter } from "@nestjs/platform-express";
import { expect } from "chai";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";

describe("AppModule", () => {
	let instance;
	let application: INestApplication;

	beforeEach(async function () {
		instance = ExpressAdapter.prototype.getInstance;
		application = await NestFactory.create(AppModule, instance);
		application.useGlobalPipes(new ValidationPipe());

		application.init();
	});

	afterEach(async function () {
		application.close();
	});

	describe("GET /", function () {
		it("should verify if default service returns 404", function (done) {
			supertest(application.getHttpServer())
				.get("/")
				.end(function (err, res) {
					expect(res.status).to.be.equal(404);
					done(err);
				});
		});
	});
});
