// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Navigation items
    const navFoodSelection = document.getElementById('nav-food-selection');
    const navSummary = document.getElementById('nav-summary');
    const navSuggestion = document.getElementById('nav-suggestion');

    // Content container
    const content = document.getElementById('content');

    // Event listeners for navigation
    navFoodSelection.addEventListener('click', loadFoodSelection);
    navSummary.addEventListener('click', loadSummary);
    navSuggestion.addEventListener('click', loadSuggestion);

    // Load default view
    loadFoodSelection();
});

// Load Food Selection View
function loadFoodSelection() {
    // Fetch food categories and display them
    // For simplicity, we'll hardcode categories
    const categories = ['Fruits', 'Vegetables', 'Grains', 'Proteins', 'Dairy'];

    let html = '<h2>Select a Food Category</h2><ul id="categories">';
    categories.forEach(category => {
        html += `<li><a href="#" onclick="selectCategory('${category}')">${category}</a></li>`;
    });
    html += '</ul><div id="food-list"></div>';

    document.getElementById('content').innerHTML = html;
}

// Handle Category Selection
function selectCategory(category) {
    // Fetch foods from JSON based on category
    fetch('data/foods.json')
        .then(response => response.json())
        .then(data => {
            const foods = data.filter(food => food.category === category);
            displayFoods(foods);
        });
}

// Display Foods in Selected Category
function displayFoods(foods) {
    let html = '<h3>Select Foods</h3><ul>';
    foods.forEach(food => {
        html += `<li>${food.name} <button onclick="addFood('${food.name}')">Add</button></li>`;
    });
    html += '</ul>';

    document.getElementById('food-list').innerHTML = html;
}

// Add Food to Daily Intake (this would update user's data)
function addFood(foodName) {
    alert(`${foodName} added to your daily intake.`);
}

// Load Summary View
function loadSummary() {
    // Display a summary of nutrients (this would pull from user's data)
    const html = `
    <h2>Summary of the Day</h2>
    <!-- Macronutrients -->
    <h3>Macronutrients</h3>
    <ul>
      <li>Calories: 2000 kcal</li>
      <li>Proteins: 75g</li>
      <li>Carbohydrates: 250g</li>
      <li>Fats: 70g</li>
      <!-- Add other macronutrients -->
    </ul>
    <!-- Vitamins -->
    <h3>Vitamins</h3>
    <!-- List vitamins -->
    <!-- Minerals -->
    <h3>Minerals</h3>
    <!-- List minerals -->
  `;
    document.getElementById('content').innerHTML = html;
}

// Load Suggestion View
function loadSuggestion() {
    // Display suggestions based on nutrient deficiencies
    const html = `
    <h2>Food Suggestions</h2>
    <p>Select a nutrient to find foods rich in it per 100kcal.</p>
    <select id="nutrient-select" onchange="loadFoodSuggestions()">
      <option value="">--Select Nutrient--</option>
      <option value="protein">Protein</option>
      <option value="fiber">Fiber</option>
      <!-- Add other nutrients -->
    </select>
    <div id="suggestions-list"></div>
  `;
    document.getElementById('content').innerHTML = html;
}

// Load Food Suggestions Based on Selected Nutrient
function loadFoodSuggestions() {
    const nutrient = document.getElementById('nutrient-select').value;
    if (nutrient) {
        fetch('data/foods.json')
            .then(response => response.json())
            .then(data => {
                // Sort foods based on nutrient content per 100kcal
                const sortedFoods = data.sort((a, b) => b.nutrients[nutrient] - a.nutrients[nutrient]);
                displaySuggestions(sortedFoods.slice(0, 10), nutrient);
            });
    }
}

// Display Food Suggestions
function displaySuggestions(foods, nutrient) {
    let html = `<h3>Top Foods Rich in ${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} per 100kcal</h3><ul>`;
    foods.forEach(food => {
        html += `<li>${food.name}: ${food.nutrients[nutrient]}g</li>`;
    });
    html += '</ul>';
    document.getElementById('suggestions-list').innerHTML = html;
}
