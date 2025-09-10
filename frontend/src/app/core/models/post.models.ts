export interface LsPost{
    title: string,
    content: string
}

export interface LsResPost{
    error?: string,
    message: string,
    status?: number
}

export interface BasePostData {
    id: number;
    title: string;
    content: string;
    authorUsername: string;
}

export interface LsAllPosts {
    data: BasePostData[],
    message: string
}

export interface LsGetPost {
    data: BasePostData & {
        comments: {
        id: number,
        content: string,
        authorUsername: string,
        postId: number,
        createdAt: Date
      }[]
    },
    message: string
}