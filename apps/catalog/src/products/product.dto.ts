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

export class ProductByIdDto{
    @IsString()
    id:string
}


export class UpdateProductDto{

    @IsString()
    id:string;

    @IsString()
    @MinLength(2)
    @IsOptional()
    name?:string;


    @IsString()
    @MinLength(4)
    @IsOptional()
    description?:string;

    @IsNumber()
    @Min(2)
    @IsOptional()
    price?:number;

    @IsString()
    @IsOptional()
    status?:ProductStatus
}