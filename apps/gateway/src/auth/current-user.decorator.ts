import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserContext } from "./auth.types";

export const CurrentUser = createParamDecorator(
    (data:unknown,ctx:ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        return request.user as UserContext | undefined;
    }
)