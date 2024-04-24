import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig, typeOrmConfig } from './common/config';
import { UserModule } from './modules';
import { AuthModule } from './modules/auth/auth.module';
import { ApiKeyMiddleware } from './modules/auth/middleware';
import { LoggerModule } from './modules/logger/logger.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [typeOrmConfig.KEY],
      useFactory: async (config: ConfigType<typeof typeOrmConfig>) => config,
    }),
    UserModule,
    RoleModule,
    AuthModule,
    LoggerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      // .exclude('(.*)')
      .exclude('auth/(.*)')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
