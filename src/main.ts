import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
	const logger = new Logger("bootstrap");
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix("api");
	app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false, transform: true }));
	app.enableCors();

	const config = new DocumentBuilder().setTitle("Sistema Bussola").setDescription("Sistema Bussola").setVersion("1.0").addBearerAuth().build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, document);

	await app.listen(process.env.PORT || 3001);
	logger.log(`Application listening on port ${process.env.PORT || 3001}`);
}
bootstrap();
