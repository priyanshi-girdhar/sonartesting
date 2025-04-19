import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/firstProject'),
    AuthModule,
    UserModule,
  ],
  controllers: [AdminController],
})
export class AppModule {}
