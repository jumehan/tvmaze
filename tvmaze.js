"use strict";

const $showsList = $("#showsList"); //show area
const $episodesArea = $("#episodesArea"); //episode area
const $searchForm = $("#searchForm"); //form
const TVMAZE_API = "https://api.tvmaze.com/search/shows";
const TVMAZE_EPISODES_API = "https://api.tvmaze.com/shows/";
const ALT_IMG = "https://tinyurl.com/tv-missing";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

//param: searchTerm
//grad ID: []

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const tvShowResults = await axios.get(TVMAZE_API, { params: { q: searchTerm } });
  // TODO: use map
  let tvShows = [];
  for (let i = 0; i < tvShowResults.data.length; i++) {
    tvShows.push({
      id: tvShowResults.data[i].show.id,
      name: tvShowResults.data[i].show.name,
      image: tvShowResults.data[i].show.image ? tvShowResults.data[i].show.image.medium : ALT_IMG,
      summary: tvShowResults.data[i].show.summary
    });
  }
    // return tvShowResults.data.map(result => {
    //   id: result.show.id,
    //   name: result.show.name,
    //   image: result.show.image ? result.show.image.medium : ALT_IMG,
    //   summary: result.show.summary});

      // return tvShowResults.map(result => {
      //   id: result.show.id,
      //   name: result.show.name,
      //   image: result.show.image ? tvShowResults.data[i].show.image.medium : ALT_IMG,
      //   summary: result.show.summary})
      return tvShows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show =

      $(
          `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
           <div class="media">
             <img
                src="${show.image}"
                alt="${show.name}"
                class="w-25 me-3">
             <div class="media-body">
               <h5 class="text-primary">${show.name}</h5>
               <div><small>${show.summary}</small></div>
               <button class="btn btn-outline-light btn-sm Show-getEpisodes">
                 Episodes
               </button>
             </div>
           </div>
         </div>
        `);

      $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */


async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {

  const tvEpisodes = await axios.get(`${TVMAZE_EPISODES_API}${id}/episodes`, {params: {q: id}});

  const episodes = [];

  for (let i = 0; i < tvEpisodes.data.length; i++) {
    episodes.push({
      id: tvEpisodes.data[i].id,
      name: tvEpisodes.data[i].name,
      season: tvEpisodes.data[i].season,
      number: tvEpisodes.data[i].number
    });
  }

  return episodes;
 }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
