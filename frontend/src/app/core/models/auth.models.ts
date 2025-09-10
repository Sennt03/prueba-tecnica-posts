export interface LsRegister{
    username: string,
    password: string
}

export interface LsLogin{
    username: string,
    password: string
}

export interface LsResAuth{
    data: {
        username: string
        token: string
        expiresIn: number
    },
    message: string
}