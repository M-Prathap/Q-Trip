import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  //const urlParams = new URLSearchParams("?city=bengaluru");
  //return urlParams.get("city");
  return search.split('=')[1]
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  try {
    // TODO: MODULE_CITIES
    // 1. Fetch cities using the Backend API and return the data
    const adventures = await fetch(config.backendEndpoint + "/adventures/?city=" + city);
    const data = await adventures.json();
    //console.log(data);
    return data;
  } catch (error) {
    //console.log(error);
    return null;
  }

}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  adventures.map((a) => {
    console.log(a);
    const html = `
    <div class="col-6 col-sm-6 col-md-6 col-lg-3 mb-4">
      <a href="./detail/?adventure=${a.id}" id="${a.id}">
        <div class="activity-card">
          <img class="activity-card img" src="${a.image}">
          <p class="category-banner">${a.category}</p>
          <div class="card-body w-100">
            <div class="d-flex flex-column">
              <div class="d-flex justify-content-between">
                <h6>${a.name}</h6>
                <p>₹${a.costPerHead}</p>
              </div>
              <div class="d-flex justify-content-between">
                <h6>Duration</h6>
                <p>${a.duration} Hours</p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  `;
    const parentElement = document.getElementById("data");
    parentElement.innerHTML += html;
  })


}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  let filteredList = list.filter((listItem) => {
    return listItem.duration >= low && listItem.duration <= high;
  });
  console.log(filterByDuration);
  return filteredList;

}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  let filteredList = list.filter((listItem) => {
    return categoryList.includes(listItem.category);
  });
  return filteredList;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  // Place holder for functionality to work in the Stubs
  let filteredList = list;
  if(filters.duration !== "") {
    const [low,high] = filters.duration.split("-");
    filteredList = filterByDuration(filteredList,Number(low), Number(high));
  }
  if (filters.category.length > 0) {
    filteredList = filterByCategory(filteredList, filters.category);
  }
  return filteredList;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  window.localStorage.setItem('filters' ,JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  // Place holder for functionality to work in the Stubs
  const filters = JSON.parse(window.localStorage.getItem('filters'));
  return filters;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  const categoryListContainer = document.getElementById("category-list");

  // Clear any existing filter pills
  categoryListContainer.innerHTML = "";

  // Generate and append filter pills based on the category filters
  filters.category.forEach((category) => {
    const pillContainer = document.createElement("div");
    pillContainer.className = "category-filter";
    const pillHTML = `<p>${category}</p>`;
    pillContainer.innerHTML = pillHTML;
    categoryListContainer.appendChild(pillContainer);
  });
console.log(generateFilterPillsAndUpdateDOM);
  // Update the duration filter value if available
  /*const durationFilterInput = document.getElementById("duration-filter");
  if (filters.duration) {
    const [min, max] = filters.duration.split("-");
    durationFilterInput.value = `${min}-${max}`;
  } else {
    durationFilterInput.value = ""; // Clear the duration filter input
  }*/

}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
