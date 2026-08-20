export interface MovieDetail {
    title: string;
    poster: string;
    year: number;
    rating: number;
    synopsis: string;
}

export type AppStatus = "idle" | "loading" | "success" | "error";