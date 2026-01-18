export type RpcErrorCode = 
| 'BAD_REQUEST'
| 'VALIDATION_ERROR'
| 'NOT_FOUND'
| 'FORBIDDEN'
| 'INTERNAL'
| 'UNAUTHORIZED'

export type RpcErrorPayload = {
    code:RpcErrorCode;
    message:string;
    details?:any
}