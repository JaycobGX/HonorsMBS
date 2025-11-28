export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  description: string;
  genre: string;
  cast: string;
  duration: string;
  status: "current" | "upcoming";
}
