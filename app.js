
/* =====================================
   MOVIES LINK - MOVIE DATABASE
===================================== */

const movies = [
  {
    id: "movie-001",
    url: "https://doodstream.com/e/YOUR_EMBED_ID",
    title: "The Last Horizon (2026)",
    category: "Action",
    thumbnail: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "movie-002",
    url: "https://doodstream.com/e/YOUR_EMBED_ID",
    title: "Midnight Memories (2025)",
    category: "Drama",
    thumbnail: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "3d9olx7ca2f8",
    url: "https://playmogo.com/e/3d9olx7ca2f8",
    title: "Beyond The Wild (2026)",
    category: "Adventure",
    thumbnail: "https://i.ibb.co/PzPhhMZf/80-Ift3zu-YFz3i-Dp-I2-Tqyt-WMPHJe.jpg"
  }
];

/* =====================================
   DOWNLOAD DATABASE

   Add actual authorized direct file URLs.
===================================== */

const downloadLinks = {
  "movie-001": {
    "480p": "",
    "720p": "",
    "1080p": ""
  },

  "movie-002": {
    "480p": "",
    "720p": "",
    "1080p": ""
  },

  "movie-003": {
    "480p": "",
    "720p": "",
    "1080p": ""
  }
};

const featuredMovieId = "movie-001";
const app = document.getElementById("app");

function getMovie(id) {
  return movies.find(movie => movie.id === id);
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function validEmbedURL(value) {
  try {
    const u = new URL(value);
    return [
      "doodstream.com",
      "www.doodstream.com",
      "dood.to",
      "dood.ws"
    ].includes(u.hostname);
  } catch {
    return false;
  }
}

function validDownloadURL(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/* =====================================
   MOVIE CARD
===================================== */

function movieCard(movie) {
  return `
    <a class="movie-card"
       href="#/movie/${encodeURIComponent(movie.id)}">

      <div class="poster">

        <img
          src="${escapeHTML(movie.thumbnail)}"
          alt="${escapeHTML(movie.title)}"
          loading="lazy"
          onerror="this.src='assets/poster-placeholder.svg'"
        >

        <span class="play-icon">▶</span>

        <span class="category">
          ${escapeHTML(movie.category)}
        </span>

      </div>

      <h3>${escapeHTML(movie.title)}</h3>

    </a>
  `;
}

/* =====================================
   HOME PAGE
===================================== */

function homePage(list = movies) {

  const featured = getMovie(featuredMovieId);
  const showHero = list.length === movies.length && featured;

  app.innerHTML = `

    ${showHero ? `

      <section class="hero"
        style="--hero:url('${escapeHTML(featured.thumbnail)}')">

        <div class="hero-content">

          <span class="eyebrow">FEATURED MOVIE</span>

          <h1>${escapeHTML(featured.title)}</h1>

          <p>
            Watch your favourite movies on Movies Link.
            Discover amazing entertainment.
          </p>

          <a class="btn primary"
             href="#/watch/${encodeURIComponent(featured.id)}">
             ▶ Watch Now
          </a>

          <a class="btn secondary"
             href="#/movie/${encodeURIComponent(featured.id)}">
             More Info
          </a>

        </div>

      </section>

    ` : ""}

    <section class="container">

      <div class="section-title">
        <h2>Popular Movies</h2>
        <span class="count">${list.length} Movies</span>
      </div>

      ${list.length
        ? `<div class="movie-grid">
             ${list.map(movieCard).join("")}
           </div>`
        : `<div class="empty">
             <h2>No Movies Found</h2>
           </div>`}

    </section>
  `;
}

/* =====================================
   MOVIE DETAILS
===================================== */

function detailsPage(id) {

  const movie = getMovie(id);

  if (!movie) return notFound();

  const related = movies.filter(m =>
    m.category === movie.category && m.id !== id
  );

  app.innerHTML = `

    <section class="details">

      <img
        src="${escapeHTML(movie.thumbnail)}"
        alt="${escapeHTML(movie.title)}"
        onerror="this.src='assets/poster-placeholder.svg'"
      >

      <div class="details-info">

        <span class="eyebrow">MOVIE DETAILS</span>

        <h1>${escapeHTML(movie.title)}</h1>

        <span class="pill">
          ${escapeHTML(movie.category)}
        </span>

        <p>
          Watch this movie online in Movies Link.
        </p>

        <a class="btn primary"
           href="#/watch/${encodeURIComponent(movie.id)}">
           ▶ Watch Online
        </a>

      </div>

    </section>

    ${related.length ? `
      <section class="container">
        <h2>Related Movies</h2>
        <div class="movie-grid">
          ${related.map(movieCard).join("")}
        </div>
      </section>
    ` : ""}

  `;
}

/* =====================================
   DOWNLOAD BUTTONS
===================================== */

function downloadButtons(movie) {

  const links = downloadLinks[movie.id] || {};

  const qualities = [
    { key: "480p", note: "Standard Quality" },
    { key: "720p", note: "HD Quality" },
    { key: "1080p", note: "Full HD Quality" }
  ];

  return qualities.map(item => {

    const url = links[item.key];
    const active = validDownloadURL(url);

    return `

      <div class="quality-row">

        <div class="quality-label">

          <strong>${item.key}</strong>

          <span>${item.note}</span>

        </div>

        ${active ? `

          <a
            class="download-btn"
            href="${escapeHTML(url)}"
            target="_blank"
            rel="noopener noreferrer">

            ↓ Download

          </a>

        ` : `

          <button
            class="download-btn disabled"
            type="button"
            disabled>

            Link Not Added

          </button>

        `}

      </div>

    `;

  }).join("");
}

/* =====================================
   VIDEO PLAYER + DOWNLOAD SECTION
===================================== */

function playerPage(id) {

  const movie = getMovie(id);

  if (!movie) return notFound();

  const usable =
    validEmbedURL(movie.url) &&
    !movie.url.includes("YOUR_EMBED_ID");

  app.innerHTML = `

    <section class="container player-page">

      <a class="back-link"
         href="#/movie/${encodeURIComponent(movie.id)}">

         ← Back to Movie

      </a>

      <div class="player-heading">

        <div>
          <span class="eyebrow">NOW PLAYING</span>
          <h1>${escapeHTML(movie.title)}</h1>
        </div>

        <span class="pill">
          ${escapeHTML(movie.category)}
        </span>

      </div>

      <!-- VIDEO PLAYER -->

      <div class="video-frame">

        ${usable ? `

          <iframe
            src="${escapeHTML(movie.url)}"
            title="${escapeHTML(movie.title)}"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>

        ` : `

          <div class="player-placeholder">

            <div class="big-play">▶</div>

            <h2>Video Link Not Added</h2>

            <p>
              Add your DoodStream embed URL in app.js.
            </p>

          </div>

        `}

      </div>

      <!-- DOWNLOAD OPTIONS BELOW PLAYER -->

      <section class="download-section">

        <div class="download-heading">

          <div>
            <span class="eyebrow">DOWNLOAD MOVIE</span>
            <h2>↓ Download Options</h2>
          </div>

          <span class="pill">Choose Quality</span>

        </div>

        <p class="download-description">
          Select your preferred video quality.
        </p>

        <div class="quality-list">

          ${downloadButtons(movie)}

        </div>

        <p class="download-help">
          Download links must be valid direct video file URLs
          that you are authorized to distribute.
        </p>

      </section>

    </section>

  `;
}

/* =====================================
   CATEGORY PAGE
===================================== */

function categoryPage(category) {

  const filtered = movies.filter(movie =>
    movie.category.toLowerCase() === category.toLowerCase()
  );

  homePage(filtered);
}

/* =====================================
   404 PAGE
===================================== */

function notFound() {

  app.innerHTML = `

    <section class="empty">

      <h1>404</h1>

      <p>Movie or page not found.</p>

      <a class="btn primary" href="#/">
        Go Home
      </a>

    </section>

  `;
}

/* =====================================
   ROUTER
===================================== */

function router() {

  const parts = decodeURIComponent(
    location.hash.replace(/^#\/?/, "")
  ).split("/").filter(Boolean);

  if (!parts.length) {
    homePage();
  }

  else if (parts[0] === "movie" && parts[1]) {
    detailsPage(parts[1]);
  }

  else if (parts[0] === "watch" && parts[1]) {
    playerPage(parts[1]);
  }

  else if (parts[0] === "category" && parts[1]) {
    categoryPage(parts[1]);
  }

  else {
    notFound();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* =====================================
   SEARCH
===================================== */

document.getElementById("search")
.addEventListener("input", function() {

  const query = this.value.trim().toLowerCase();

  if (!query) {
    if (!location.hash || location.hash === "#/") {
      homePage();
    }
    return;
  }

  const filtered = movies.filter(movie =>
    movie.title.toLowerCase().includes(query) ||
    movie.category.toLowerCase().includes(query)
  );

  homePage(filtered);

});

/* =====================================
   INITIALIZE
===================================== */

window.addEventListener("hashchange", router);

router();
