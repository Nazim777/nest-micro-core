import { INestMicroservice, ValidationPipe } from "@nestjs/common";
import { RpcAllExecptionFilter } from "./rpc-exception.filter";


export function applyToMicroserviceLayer(app:INestMicroservice){
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist:true,
            forbidNonWhitelisted:true,
            transform:true
        })
    )
    app.useGlobalFilters(new RpcAllExecptionFilter())
}