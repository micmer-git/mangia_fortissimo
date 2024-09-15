import { foodData } from './data/foodDatabase.js';


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
    if (foodData[category]) {
        // Handle the category data
        console.log(foodData[category]);
    } else {
        console.error('Category not found');
    }
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
    const portion = prompt(`Enter portion size for ${foodName} (in grams):`, 100);
    if (portion) {
        dailyIntake.push({ foodName, portion: parseFloat(portion) });
        localStorage.setItem('dailyIntake', JSON.stringify(dailyIntake));
        alert(`${foodName} (${portion}g) added to your daily intake.`);
    }
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
        dailyIntake.push({ foodName, portion: parseFloat(portion) });
        localStorage.setItem('dailyIntake', JSON.stringify(dailyIntake));
        alert(`${foodName} (${portion}g) added to your daily intake.`);
    }
}

/function loadSummary() {
// Initialize totals
let totalCalories = 0;
let totalProtein = 0;
let totalCarbs = 0;
let totalFats = 0;
// ... other nutrients

// Fetch food data to calculate totals
fetch('data/foods.json')
    .then(response => response.json())
    .then(data => {
        dailyIntake.forEach(item => {
            const food = data.find(f => f.name === item.foodName);
            if (food) {
                const factor = item.portion / 100; // Assuming nutrients are per 100g
                totalCalories += food.nutrients.calories * factor;
                totalProtein += food.nutrients.protein * factor;
                totalCarbs += food.nutrients.carboidrati * factor;
                totalFats += food.nutrients.grassi_totali * factor;
                // ... other nutrients
            }
        });

        // Display the summary
        const html = `
                <h2>Summary of the Day</h2>
                <ul>
                    <li>Calories: ${totalCalories.toFixed(2)} kcal</li>
                    <li>Proteins: ${totalProtein.toFixed(2)}g</li>
                    <li>Carbohydrates: ${totalCarbs.toFixed(2)}g</li>
                    <li>Fats: ${totalFats.toFixed(2)}g</li>
                    <!-- Add other nutrients here -->
                </ul>
                <canvas id="macronutrientChart"></canvas>
            `;
        document.getElementById('content').innerHTML = html;

        // Create chart
        const ctx = document.getElementById('macronutrientChart').getContext('2d');
        new Chart(ctx, {
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
    })
    .catch(error => {
        console.error('Error loading food data:', error);
        document.getElementById('content').innerHTML = '<p>Error loading summary. Please try again later.</p>';
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
