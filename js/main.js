lucide.createIcons();

const SUSHI_JSON_PATH = "./data/sushi.json";
const DRINK_JSON_PATH = "./data/drink.json";

let sushiData = [];
let drinkData = [];

let currentData = [];
let currentTab = "sushi";
let currentCategory = "all";
let currentAvailability = "all";

const tabs = document.querySelectorAll(".tab-button");
const categoryFilter = document.getElementById("categoryFilter");
const availabilityFilter = document.getElementById("availabilityFilter");
const itemsList = document.getElementById("itemsList");

const categoryMap = {
    sushi: ["Maki", "Nigiri", "Sashimi", "Donburi"],
    drinks: ["Tea", "Juice", "Alcohol"],
};

function init() {
    fetch(SUSHI_JSON_PATH)
        .then((res) => res.json())
        .then((data) => {
            sushiData = data;
            return fetch(DRINK_JSON_PATH);
        })
        .then((res) => res.json())
        .then((data) => {
            drinkData = data;
            currentData = sushiData;
            populateCategoryOptions("sushi");
            setActiveTab("sushi"); // Mark Sushi tab active at start
            renderItems();
            addEventListeners();
        })
        .catch((err) => console.error("Error fetching data:", err));
}

function addEventListeners() {
    tabs.forEach((tab) => {
        tab.addEventListener("click", switchTab);
    });
    categoryFilter.addEventListener("change", filterItems);
    availabilityFilter.addEventListener("change", filterItems);
}

function switchTab(e) {
    currentTab = e.target.dataset.tab;
    setActiveTab(currentTab);

    if (currentTab === "sushi") {
        currentData = sushiData;
    } else {
        currentData = drinkData;
    }

    currentCategory = "all";
    currentAvailability = "all";
    availabilityFilter.value = "all";

    populateCategoryOptions(currentTab);
    renderItems();
}

/**
 * Adds the 'active' class to the clicked tab and removes it from the others
 */
function setActiveTab(tabName) {
    tabs.forEach((tab) => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });
}

function populateCategoryOptions(tab) {
    categoryFilter.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All";
    categoryFilter.appendChild(allOption);

    categoryMap[tab].forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    categoryFilter.value = "all";
}

function filterItems() {
    currentCategory = categoryFilter.value;
    currentAvailability = availabilityFilter.value;
    renderItems();
}

function renderItems() {
    const filteredItems = currentData.filter((item) => {
        const matchesCategory =
            currentCategory === "all" || item.category === currentCategory;
        const matchesAvailability =
            currentAvailability === "all" ||
            (currentAvailability === "available" && item.availability) ||
            (currentAvailability === "unavailable" && !item.availability);

        return matchesCategory && matchesAvailability;
    });

    const html = filteredItems
        .map((item) => {
            const isAvailable = item.availability;
            const itemType = currentTab;
            return `
        <div 
          class="item" 
          style="width: 100px; border: 2px solid red; opacity: ${
              isAvailable ? 1 : 0.5
          }"
        >
          ${
              isAvailable
                  ? `<a 
                    href="details.html?id=${item.id}&type=${itemType}" 
                    style="text-decoration: none; color: inherit;"
                 >
                    <img 
                      src="${item.image}" 
                      alt="${item.name}" 
                      style="width: 100px; height: 100px;" 
                    />
                    <div>
                      <h3>${item.name}</h3>
                      <p>${item.desc}</p>
                      ${
                          item.servingSize
                              ? `<p><strong>Serving Size:</strong> ${item.servingSize}</p>`
                              : ""
                      }
                      <p><strong>Price:</strong> ₱${item.price}</p>
                    </div>
                </a>`
                  : `<span class="unavailable">
                  <img 
                    src="${item.image}" 
                    alt="${item.name}" 
                    style="width: 100px; height: 100px;" 
                  />
                  <div>
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                    ${
                        item.servingSize
                            ? `<p><strong>Serving Size:</strong> ${item.servingSize}</p>`
                            : ""
                    }
                    <p><strong>Price:</strong> ₱${item.price}</p>
                  </div>
                </span>`
          }
        </div>
      `;
        })
        .join("");

    itemsList.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", init);
