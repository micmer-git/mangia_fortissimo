
let data = [];

fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        renderResults(data);
    });



// Function to create progress bars
function createProgressBar(label, value, maxValue) {
    const percentage = (value / maxValue) * 100;
    return `
        <div>
            <label>${label}: ${value}${label === 'Calories' ? 'kcal' : 'g'}</label>
            <div class="progress-bar">
                <div class="progress" style="width: ${percentage > 100 ? 100 : percentage}%;">
                    ${percentage > 10 ? `${Math.round(percentage)}%` : ''}
                </div>
            </div>
        </div>
    `;
}



// Function to render results
function renderResults(items) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    items.forEach(item => {
        const totalMacros = item.macros.protein + item.macros.fat + item.macros.carbs;
        const calories = (item.macros.protein * 4) + (item.macros.fat * 9) + (item.macros.carbs * 4);

        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <h2>${item.name}</h2>
            <div class="content">
                <h3>Macros</h3>
                ${createProgressBar('Protein', item.macros.protein, totalMacros)}
                ${createProgressBar('Fat', item.macros.fat, totalMacros)}
                ${createProgressBar('Carbs', item.macros.carbs, totalMacros)}
                <h3>Micros</h3>
                ${Object.entries(item.micros).map(([key, value]) => `<p>${key}: ${value}mg</p>`).join('')}
                <h3>Vitamins</h3>
                ${Object.entries(item.vitamins).map(([key, value]) => `<p>${key}: ${value}mg</p>`).join('')}
                <h3>Calories</h3>
                ${createProgressBar('Calories', calories, 2000)}
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// Search Functionality
document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filteredData = data.filter(item => item.name.toLowerCase().includes(query));
    renderResults(filteredData);
});

// Initial Render
renderResults(data);
