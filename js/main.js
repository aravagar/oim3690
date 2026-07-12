// Logic lives here. Only the one thing this file actually needs (the
// movies array) is imported, nothing else from data.js leaks in.
import { movies } from "./data.js";

const listEl = document.getElementById("movie-list");

function renderMovies() {
  listEl.innerHTML = "";
  for (const movie of movies) {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <div class="movie-title">${movie.title}</div>
      <div class="movie-meta">${movie.year} &middot; ${movie.genre}</div>
    `;
    listEl.appendChild(card);
  }
}

renderMovies();
