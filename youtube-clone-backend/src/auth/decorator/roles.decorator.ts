// https://docs.nestjs.com/fundamentals/execution-context#low-level-approach

import { SetMetadata } from '@nestjs/common';

// SetMetadata decorator provides the ability to attach custom metadata to route handlers
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
