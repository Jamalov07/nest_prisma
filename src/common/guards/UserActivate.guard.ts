import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
      const req = context.switchToHttp().getRequest();
      console.log(req)
      const headers = req.headers.authorization;
      console.log(headers);
    const [bearer, token] = headers.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new BadRequestException('Siz ro`yhatdan o`tmagansiz');
    }
    return true;
  }
}
