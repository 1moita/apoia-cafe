import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  async(_: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
);