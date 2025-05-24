/**************************[ HUB PAGE PRESENTATION ]*/
export interface HubPagePresentation {
    location: string;
    text: string[];
};
/****************************************************/


/************************************[ HUB PROJECT ]*/
interface Skill {
    name: string;
    icon: string;
};

interface Starting {
    name: string;
    link: string;
};

export interface HubProject {
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