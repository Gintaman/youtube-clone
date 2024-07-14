import { Injectable } from '@nestjs/common';
// @nestjs/passport https://docs.nestjs.com/recipes/passport
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
