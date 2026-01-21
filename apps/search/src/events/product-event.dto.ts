import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";


export class ProductCreatedForSearchDto{

    @IsString()
    productId:string;

    @IsString()
    name:string;

    @IsString()
    description:string;


    @IsIn(['DRAFT','ACTIVE'])
    status:'DRAFT' | 'ACTIVE';

    @IsNumber()
    price:number;

    @IsOptional()
    @IsString()
    imageUrl?:string;

    @IsString()
    createdByClerkUserId:string;
}

export class ProductUpdatedForSearchDto{
    @IsString()
    productId:string;

    @IsString()
    @IsOptional()
    name?:string;

    @IsString()
    @IsOptional()
    description?:string;


    @IsOptional()
    @IsIn(['DRAFT','ACTIVE'])
    status?:'DRAFT' | 'ACTIVE';

    @IsNumber()
    @IsOptional()
    price?:number;

}

export class DeleteSearchByProductId{

    @IsString()
    productId:string;
}