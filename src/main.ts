import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
	const logger = new Logger("bootstrap");
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder().setTitle("Base API").setDescription("Base API example").setVersion("1.0").addBearerAuth().build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, document);

	await app.listen(process.env.PORT);
	logger.log(`Application listening on port ${process.env.PORT}`);
}
bootstrap();
