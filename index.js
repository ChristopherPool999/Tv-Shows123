const searchBarEle = document.querySelector("#search__bar");
const searchResultsEle = document.querySelector(".search__results__container");
const homeContainerEle = document.querySelector(".home__container");
const searchTermEle = document.querySelector("#search__term"); 
const resultsExpandCon = document.querySelector(".results__expand__container");
const resultsExpandBg = document.querySelector(".results__expand__bg");
const exitBtn = document.querySelector("#x_btn");

const showResults = (apiData) => {

    const returnApiDataUnlessNull = (htmlTag1, apiValues, htmlTag2) => { // inner function returnResultsHTML()
        if (apiValues === null || apiValues.length < 1) {
            return htmlTag1 + "N/A" + htmlTag2;
         } else {
            return htmlTag1 + apiValues + htmlTag2;
         }
    };

    const returnResultsHTML = (i, imgHeight, imgWidth, className) => {
        return `
        <div  id="results${i}" class="${className}">
            <img id="booty" src="${apiData[i].show.image.medium}" alt="show img" width="${imgWidth}" height="${imgHeight}">
                <div class="results__info id="${i}" data-simplebar data-simplebar-auto-hide="false">
                    ${returnApiDataUnlessNull(`<h1 class id="results__title">`, apiData[i].show.name, `</h1>`)}
                    ${returnApiDataUnlessNull(`<span>Rating: `, apiData[i].show.rating.average, `</span>`)}
                    ${returnApiDataUnlessNull(`<p>Genres: `, apiData[i].show.genres, `</p>`)}
                    ${returnApiDataUnlessNull(`<p>Runtime: `, apiData[i].show.runtime, ' min</p>')}
                    ${returnApiDataUnlessNull(`<p>Aired: `, apiData[i].show.premiered, `</p>`)}
                    ${returnApiDataUnlessNull(`<span>Status:  `, apiData[i].show.status, `</span>`)}
                    ${returnApiDataUnlessNull(`<p id="results__summary">Summary: `, apiData[i].show.summary, `</p>`)}
                </div>
        </div>`
    }

    const returnExpandResultsHTML = (i) => {
        return `
        <div>
            <div id="results__img__expand">
                <img src="${apiData[i].show.image.medium}" alt="show img" width="300px" height="300px">
            </div>
            ${returnApiDataUnlessNull(apiData[i].show.name, `<h1 class id="results__expand__title">`, `</h1>`)}
            ${returnApiDataUnlessNull(`<span>Rating: `, apiData[i].show.rating.average, `</span>`)}
            ${returnApiDataUnlessNull(`<p>Genres: `, apiData[i].show.genres, `</p>`)}
            ${returnApiDataUnlessNull(`<p>Runtime: `, apiData[i].show.runtime, ' min</p>')}
            ${returnApiDataUnlessNull(`<p>Aired: `, apiData[i].show.premiered, `</p>`)}
            ${returnApiDataUnlessNull(`<span>Status:  `, apiData[i].show.status, `</span>`)}
            ${returnApiDataUnlessNull(`<p id="results__summary">Summary: `, apiData[i].show.summary, `</p>`)}
        </div>`
    }
    
    const showMoreInfoOverlay = () => {
        // Create more info section
        const results = document.querySelectorAll(".results");
        results.forEach((element, i) => {
            element.addEventListener("click", () => {
                resultsExpandCon.innerHTML += returnExpandResultsHTML(i, `100%`, `100%`, `results__expand`);
                resultsExpandCon.style.zIndex = "99";
                resultsExpandBg.style.color = "Black";
                resultsExpandBg.style.zindex = "1000000000000000000000000000000000000";
                exitBtn.style.zIndex = "101"; 
                exitBtn.style.opacity = "1";
                results.forEach(element => {
                    element.style.zIndex = "-1";
                });
            })
        // Delete more info section
        exitBtn.addEventListener("click", () => {
            resultsExpandCon.innerHTML = `<div class="results__expand__bg"></div>`;
            resultsExpandBg.innerHTML = "";
            exitBtn.style.opacity = "0";
            resultsExpandCon.style.zindex = "-99";
            resultsExpandBg.style.zindex = "-99";
            results.forEach(element => {
                element.style.zIndex = "99";
            });
            })
        }) 
    }

    // function main
    if (apiData.length === 0) {
        searchResultsEle.innerHTML += `<p id="no__results">No results were found: </p>`;
    } else {
        for (let i = 0; i < apiData.length; i++) {
            searchResultsEle.innerHTML += returnResultsHTML(i, `300px`, `300px`, `results`);
            showMoreInfoOverlay();
        }
    }           
}

// file main
searchBarEle.addEventListener("keypress", (btn) => {
    if (btn.key === "Enter") {
        searchResultsEle.innerHTML = "";
        homeContainerEle.innerHTML = "";
        async function obtainResultsFromApi() {
            let response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchBarEle.value}`)
            let apiData = await response.json()
            showResults(apiData)
        }
        obtainResultsFromApi();
        searchTermEle.innerHTML = "Showing results for: " + searchBarEle.value;
        searchBarEle.value = "";   
    }
});
