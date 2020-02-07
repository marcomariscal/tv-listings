/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const baseUrl = "https://api.tvmaze.com/search/shows";
  let { data } = await axios.get(baseUrl, { params: { q: query } });

  let shows = [];
  for (const item of data) {
    const { id, name, summary } = item.show;
    const image = item.show.image
      ? item.show.image.medium
      : "https://tinyurl.com/tv-missing";
    shows.push({ id, name, summary, image });
  }

  return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-primary episodes-button">Get Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above
  const baseUrl = "http://api.tvmaze.com/shows";
  let { data } = await axios.get(`${baseUrl}/${id}/episodes`);

  let episodes = [];
  for (const item of data) {
    const { id, name, season, number } = item;
    episodes.push({ id, name, season, number });
  }

  return episodes;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name}, (Season: ${episode.season}, Episode: ${episode.number})</li>`
    );

    $episodesList.append($item);
  }

  $("#episodesModal").modal("show");
}

$("#shows-list").on("click", ".episodes-button", async function handleClick(
  evt
) {
  let $parent = $(evt.target)
    .parents()
    .eq(1);

  const id = $parent.data().showId;

  let episodes = await getEpisodes(id);

  populateEpisodes(episodes);
});
