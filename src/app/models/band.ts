export interface Album {
    id: string;
    name: string;
    release_date: string;
    images: { url: string }[];
}

export interface Track {
    id: string;
    name: string;
    preview_url: string;
}
