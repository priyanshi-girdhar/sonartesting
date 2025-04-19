import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user/user.service';

@Injectable()
export class FakeAuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const username = req.query.username as string;
    

    if (!username) {
      req.user= { username: 'guest', role: 'guest' };
      return next();
    }

    const user = await this.userService.findByUsername(username);
    if (user) {
      req.user = user;
    } else {
      req.user = { username: 'guest', role: 'guest' };
    }

    next();
  }
}
