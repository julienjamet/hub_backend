export interface User {
    _id?: string;
    pseudo: string;
    email: string;
    password: string;
    picture?: string;
    bio?: string;
    followers?: string[];
    followings?: string[];
    likes?: string[];
    save?: () => Promise<void>;
};


export interface Comment {
    _id: string;
    commenterId: string;
    commenterPseudo: string;
    text: string;
    timestamp: number;
};

export interface Post {
    posterId: string;
    posterPseudo: string;
    message: string;
    picture: string;
    likers: string[];
    comments: Comment[];
    save?: () => Promise<void>;
};

export interface Errors {
    pseudo: string;
    email: string;
};