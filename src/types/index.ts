import { ImageSourcePropType } from 'react-native';

export interface User {
    name: string;
    email: string;
    avatar: ImageSourcePropType;
}

export interface WikiPage {
    id: string;
    title: string;
    content?: string;
    lastModified?: number;
}
export interface SearchResult {
    id: string;
    title: string;
    score?: number;
    snippet?: string;
}