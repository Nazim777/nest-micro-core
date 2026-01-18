import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import type { ProductStatus } from "./product.schema";

export class CreateProductDto{

    @IsString()
    @MinLength(2)
    name:string;

    @IsNumber()
    @Min(0)
    price:number;

    @IsOptional()
    @IsString()
    status?:ProductStatus;

    @IsString()
    @MinLength(4)
    description:string;

    @IsString()
    @IsOptional()
    imageUrl?:string

    @IsString()
    createdByClerkUserId:string;
}

export class GetProductByIdDto{
    @IsString()
    id:string
}