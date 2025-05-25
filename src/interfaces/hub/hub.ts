/************************************[ PAGE HEADER ]*/
export interface PageHeader {
    location: string;
    text: string[];
};
/****************************************************/


/****************************************[ PROJECT ]*/
interface Skill {
    name: string;
    icon: string;
};

interface Starting {
    name: string;
    link: string;
};

export interface Project {
    number: number;
    name: string;
    image: string;
    subject: string;
    skills: Skill[];
    difficulty: number;
    startings: Starting[];
    category: string;
    available: boolean;
};
/****************************************************/