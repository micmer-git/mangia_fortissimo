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



function addFood(foodName) {
    // Prompt user for portion size
    const portion = prompt(`Enter portion size for ${foodName} (in grams):`, 100);
    if (portion) {
        // Add the food to the daily intake (store in local storage or a variable)
        alert(`${foodName} (${portion}g) added to your daily intake.`);
        // Update the user's data accordingly
    }
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


function loadSummary() {
    // Calculate totals (same as before)

    // After calculating totals, display chart
    const html = `
    <h2>Summary of the Day</h2>
    <canvas id="macronutrientChart"></canvas>
  `;
    document.getElementById('content').innerHTML = html;

    // Create chart
    const ctx = document.getElementById('macronutrientChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Proteins', 'Carbs', 'Fats'],
            datasets: [{
                data: [totalProtein, totalCarbs, totalFats],
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Macronutrient Distribution'
            }
        }
    });
}


// Initialize daily intake
let dailyIntake = JSON.parse(localStorage.getItem('dailyIntake')) || [];

// Update addFood function
function addFood(foodName) {
    const portion = prompt(`Enter portion size for ${foodName} (in grams):`, 100);
    if (portion) {
        dailyIntake.push({ foodName, portion });
        localStorage.setItem('dailyIntake', JSON.stringify(dailyIntake));
        alert(`${foodName} (${portion}g) added to your daily intake.`);
    }
}

// Update loadSummary function to display daily intake
function loadSummary() {
    // Calculate totals from dailyIntake
    let totalCalories = 0;
    let totalProtein = 0;
    // ... other nutrients

    // Fetch food data to calculate totals
    fetch('data/foods.json')
        .then(response => response.json())
        .then(data => {
            dailyIntake.forEach(item => {
                const food = data.find(f => f.name === item.foodName);
                const factor = item.portion / 100; // Assuming nutrients are per 100g
                totalCalories += food.nutrients.calories * factor;
                totalProtein += food.nutrients.protein * factor;
                // ... other nutrients
            });

            // Display the summary
            const html = `
        <h2>Summary of the Day</h2>
        <ul>
          <li>Calories: ${totalCalories.toFixed(2)} kcal</li>
          <li>Proteins: ${totalProtein.toFixed(2)}g</li>
          <!-- Other nutrients -->
        </ul>
      `;
            document.getElementById('content').innerHTML = html;
        });
}
function loadFoodSuggestions() {
    const nutrient = document.getElementById('nutrient-select').value;
    if (nutrient) {
        fetch('data/foods.json')
            .then(response => response.json())
            .then(data => {
                // Calculate nutrient per 100kcal
                const foodsPer100kcal = data.map(food => {
                    const nutrientPer100kcal = (food.nutrients[nutrient] / food.nutrients.calories) * 100;
                    return { name: food.name, value: nutrientPer100kcal };
                });

                // Sort foods
                const sortedFoods = foodsPer100kcal.sort((a, b) => b.value - a.value);
                displaySuggestions(sortedFoods.slice(0, 10), nutrient);
            });
    }
}