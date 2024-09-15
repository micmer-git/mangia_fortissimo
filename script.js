// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const navFoodSelection = document.getElementById('nav-food-selection');
    const navSummary = document.getElementById('nav-summary');
    const navSuggestion = document.getElementById('nav-suggestion');
    const content = document.getElementById('content');

    navFoodSelection.addEventListener('click', loadFoodSelection);
    navSummary.addEventListener('click', loadSummary);
    navSuggestion.addEventListener('click', loadSuggestion);

    loadFoodSelection();
});

function loadFoodSelection() {
    fetch('data/food.json')
        .then(response => response.json())
        .then(data => {
            const categories = Object.keys(data);
            let html = '<h2>Select a Food Category</h2><div class="neumorphic">';
            categories.forEach(category => {
                html += `<button onclick="selectCategory('${category}')">${category}</button>`;
            });
            html += '</div><div id="food-list"></div>';
            document.getElementById('content').innerHTML = html;
        });
}

function selectCategory(category) {
    fetch('data/food.json')
        .then(response => response.json())
        .then(data => {
            const foods = data[category];
            displayFoods(foods, category);
        });
}

function displayFoods(foods, category) {
    let html = `<h3>${category}</h3><div class="neumorphic">`;
    foods.forEach(food => {
        html += `<div>${food.name} ${food.emoji} <button onclick="addFood('${category}', '${food.name}')">Add</button></div>`;
    });
    html += '</div>';
    document.getElementById('food-list').innerHTML = html;
}

let dailyIntake = [];

function addFood(category, foodName) {
    fetch('data/food.json')
        .then(response => response.json())
        .then(data => {
            const food = data[category].find(f => f.name === foodName);
            const portion = prompt(`Enter portion size for ${foodName} (in grams):`, food.portion);
            if (portion) {
                const scaleFactor = portion / food.portion;
                const scaledNutrients = {};
                Object.keys(food.nutrients).forEach(nutrient => {
                    scaledNutrients[nutrient] = food.nutrients[nutrient] * scaleFactor;
                });
                dailyIntake.push({
                    name: food.name,
                    portion: parseInt(portion),
                    calories: food.calories * scaleFactor,
                    nutrients: scaledNutrients
                });
                alert(`${food.name} (${portion}g) added to your daily intake.`);
            }
        });
}

function loadSummary() {
    const totalNutrients = dailyIntake.reduce((acc, food) => {
        Object.keys(food.nutrients).forEach(nutrient => {
            acc[nutrient] = (acc[nutrient] || 0) + food.nutrients[nutrient];
        });
        acc.calories = (acc.calories || 0) + food.calories;
        return acc;
    }, {});

    let html = '<h2>Summary of the Day</h2><div class="neumorphic">';
    html += `<p>Total Calories: ${totalNutrients.calories.toFixed(2)} kcal</p>`;
    html += '<h3>Macronutrients</h3>';
    html += `<p>Carbohydrates: ${totalNutrients.carboidrati.toFixed(2)}g</p>`;
    html += `<p>Proteins: ${totalNutrients.proteine.toFixed(2)}g</p>`;
    html += `<p>Fats: ${totalNutrients.grassi_totali.toFixed(2)}g</p>`;
    html += '<h3>Micronutrients</h3>';
    Object.keys(totalNutrients).forEach(nutrient => {
        if (!['calories', 'carboidrati', 'proteine', 'grassi_totali'].includes(nutrient)) {
            html += `<p>${nutrient}: ${totalNutrients[nutrient].toFixed(2)}g</p>`;
        }
    });
    html += '</div>';
    document.getElementById('content').innerHTML = html;
}

function loadSuggestion() {
    let html = `
    <h2>Food Suggestions</h2>
    <div class="neumorphic">
        <p>Select a nutrient to find foods rich in it per 100kcal.</p>
        <select id="nutrient-select" onchange="loadFoodSuggestions()">
            <option value="">--Select Nutrient--</option>
            <option value="proteine">Protein</option>
            <option value="fibre">Fiber</option>
            <option value="vitaminaC">Vitamin C</option>
            <option value="ferro">Iron</option>
        </select>
    </div>
    <div id="suggestions-list"></div>
    `;
    document.getElementById('content').innerHTML = html;
}

function loadFoodSuggestions() {
    const nutrient = document.getElementById('nutrient-select').value;
    if (nutrient) {
        fetch('data/food.json')
            .then(response => response.json())
            .then(data => {
                const allFoods = Object.values(data).flat();
                const sortedFoods = allFoods.sort((a, b) => {
                    const aRatio = a.nutrients[nutrient] / (a.calories / 100);
                    const bRatio = b.nutrients[nutrient] / (b.calories / 100);
                    return bRatio - aRatio;
                });
                displaySuggestions(sortedFoods.slice(0, 10), nutrient);
            });
    }
}

function displaySuggestions(foods, nutrient) {
    let html = `<h3>Top Foods Rich in ${nutrient} per 100kcal</h3><div class="neumorphic">`;
    foods.forEach(food => {
        const ratio = (food.nutrients[nutrient] / (food.calories / 100)).toFixed(2);
        html += `<p>${food.name} ${food.emoji}: ${ratio}g per 100kcal</p>`;
    });
    html += '</div>';
    document.getElementById('suggestions-list').innerHTML = html;
}