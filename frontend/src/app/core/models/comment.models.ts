// MODELOS PARA TIPAR LAS PETICIONES DE LOS SERVICIOS
export interface LsCommentCreate{
    content: string
}

export interface LsResComment{
    error?: string,
    message: string,
    status?: number
}