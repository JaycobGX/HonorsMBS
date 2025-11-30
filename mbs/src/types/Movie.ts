export interface Movie {
  id: string; // Unique ID for the movie
  title: string; // Movie title
  posterUrl: string; // URL to the movie poster image
  description: string; // Brief description  of the movie
  genre: string; // Movie genre (e.g., Action, Comedy)
  cast: string; // Cast members as a string that is comma seperated
  duration: string; // Movie runtime
  status: "current" | "upcoming"; // Whether the movie is currently showing or coming soon
}
