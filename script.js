let data = [];
let selectedCategory = 'All';
let dailyTotals = {
    macros: { protein: 0, fat: 0, carbs: 0 },
    micros: {},
    vitamins: {}
};

fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        updateDailyTotals();
        renderFoodItems();
        renderDailyTotals();
    });
// Function to create progress bars
function createProgressBar(label, value, maxValue) {
    const percentage = (value / maxValue) * 100;
    return `
        <div>
            <label>${label}: ${value.toFixed(2)}${label === 'Calories' ? ' kcal' : ' g'}</label>
            <div class="progress-bar">
                <div class="progress" style="width: ${percentage > 100 ? 100 : percentage}%;">
                </div>
            </div>
        </div>
    `;
}

// Function to render food items
function renderFoodItems() {
    const foodContainer = document.getElementById('food-items');
    if (!foodContainer) {
        console.error("Food container not found");
        return;
    }
    foodContainer.innerHTML = '';

    const filteredData = selectedCategory === 'All' ? data : data.filter(item => item.category === selectedCategory);

    filteredData.forEach(item => {
        const totalMacros = (item.macros.protein + item.macros.fat + item.macros.carbs) * item.quantity;
        const calories = ((item.macros.protein * 4) + (item.macros.fat * 9) + (item.macros.carbs * 4)) * item.quantity;

        const card = document.createElement('div');
        card.className = 'food-card neumorphic';
        card.innerHTML = `
            <h2>${item.name}</h2>
            <div class="adjust-quantity">
                <button class="decrease" data-name="${item.name}">-</button>
                <span>${item.quantity.toFixed(2)}</span>
                <button class="increase" data-name="${item.name}">+</button>
            </div>
            <div class="content">
                <h3>Macros</h3>
                ${createProgressBar('Protein', item.macros.protein * item.quantity, totalMacros)}
                ${createProgressBar('Fat', item.macros.fat * item.quantity, totalMacros)}
                ${createProgressBar('Carbs', item.macros.carbs * item.quantity, totalMacros)}
                <h3>Calories</h3>
                ${createProgressBar('Calories', calories, 2000)}
            </div>
        `;
        foodContainer.appendChild(card);
    });

    attachEventListeners();
}

// Function to attach event listeners to buttons
function attachEventListeners() {
    document.querySelectorAll('.increase').forEach(button => {
        button.removeEventListener('click', handleIncrease);
        button.addEventListener('click', handleIncrease);
    });

    document.querySelectorAll('.decrease').forEach(button => {
        button.removeEventListener('click', handleDecrease);
        button.addEventListener('click', handleDecrease);
    });
}

// Function to adjust quantity
function adjustQuantity(name, amount) {
    data = data.map(item => {
        if (item.name === name) {
            item.quantity = Math.max(0, item.quantity + amount);
        }
        return item;
    });
    updateDailyTotals();
    renderFoodItems();
    renderDailyTotals();
}

// Function to update daily totals
function updateDailyTotals() {
    dailyTotals = {
        macros: { protein: 0, fat: 0, carbs: 0 },
        calories: 0
    };

    data.forEach(item => {
        dailyTotals.macros.protein += item.macros.protein * item.quantity;
        dailyTotals.macros.fat += item.macros.fat * item.quantity;
        dailyTotals.macros.carbs += item.macros.carbs * item.quantity;
    });

    dailyTotals.calories = (dailyTotals.macros.protein * 4) + (dailyTotals.macros.fat * 9) + (dailyTotals.macros.carbs * 4);
}

// Function to render daily totals
function renderDailyTotals() {
    const totalsContent = document.getElementById('totals-content');
    const totalMacros = dailyTotals.macros.protein + dailyTotals.macros.fat + dailyTotals.macros.carbs;

    totalsContent.innerHTML = `
        <h3>Macros</h3>
        ${createProgressBar('Protein', dailyTotals.macros.protein, totalMacros)}
        ${createProgressBar('Fat', dailyTotals.macros.fat, totalMacros)}
        ${createProgressBar('Carbs', dailyTotals.macros.carbs, totalMacros)}
        <h3>Calories</h3>
        ${createProgressBar('Calories', dailyTotals.calories, 2000)}
    `;
}

// Category Button Event Listeners
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        selectedCategory = button.dataset.category;
        renderFoodItems();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Initial Render
    updateDailyTotals();
    renderFoodItems();
    renderDailyTotals();
});

