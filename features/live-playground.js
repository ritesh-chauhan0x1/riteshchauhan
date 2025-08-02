class LivePlayground {
    constructor() {
        this.apps = {
            calculator: {
                html: `<div class="calculator-app">
    <div class="calc-display" id="display">0</div>
    <div class="calc-buttons">
        <button onclick="clearDisplay()" class="btn clear">C</button>
        <button onclick="deleteLast()" class="btn delete">⌫</button>
        <button onclick="appendToDisplay('/')" class="btn operator">÷</button>
        <button onclick="appendToDisplay('*')" class="btn operator">×</button>
        
        <button onclick="appendToDisplay('7')" class="btn number">7</button>
        <button onclick="appendToDisplay('8')" class="btn number">8</button>
        <button onclick="appendToDisplay('9')" class="btn number">9</button>
        <button onclick="appendToDisplay('-')" class="btn operator">-</button>
        
        <button onclick="appendToDisplay('4')" class="btn number">4</button>
        <button onclick="appendToDisplay('5')" class="btn number">5</button>
        <button onclick="appendToDisplay('6')" class="btn number">6</button>
        <button onclick="appendToDisplay('+')" class="btn operator">+</button>
        
        <button onclick="appendToDisplay('1')" class="btn number">1</button>
        <button onclick="appendToDisplay('2')" class="btn number">2</button>
        <button onclick="appendToDisplay('3')" class="btn number">3</button>
        <button onclick="calculate()" class="btn equals" rowspan="2">=</button>
        
        <button onclick="appendToDisplay('0')" class="btn number zero">0</button>
        <button onclick="appendToDisplay('.')" class="btn number">.</button>
    </div>
</div>`,
                css: `.calculator-app {
    max-width: 300px;
    margin: 20px auto;
    background: linear-gradient(145deg, #2d3748, #4a5568);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.calc-display {
    background: #1a202c;
    color: #63b3ed;
    font-size: 2rem;
    padding: 20px;
    text-align: right;
    border-radius: 10px;
    margin-bottom: 15px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: 'Courier New', monospace;
}

.calc-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.btn {
    background: linear-gradient(145deg, #4a5568, #2d3748);
    border: none;
    color: white;
    font-size: 1.2rem;
    padding: 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.btn:active {
    transform: translateY(0);
}

.btn.operator {
    background: linear-gradient(145deg, #667eea, #764ba2);
}

.btn.equals {
    background: linear-gradient(145deg, #48bb78, #38a169);
    grid-row: span 2;
}

.btn.clear {
    background: linear-gradient(145deg, #f56565, #e53e3e);
}

.btn.zero {
    grid-column: span 2;
}`,
                js: `let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForOperand = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function appendToDisplay(value) {
    if (waitingForOperand) {
        currentInput = value;
        waitingForOperand = false;
    } else {
        currentInput = currentInput === '0' ? value : currentInput + value;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForOperand = false;
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    updateDisplay();
}

function calculate() {
    if (operator && previousInput !== null) {
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result;
        
        switch(operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '*': result = prev * current; break;
            case '/': result = current !== 0 ? prev / current : 'Error'; break;
            default: return;
        }
        
        currentInput = result.toString();
        operator = null;
        previousInput = null;
        waitingForOperand = true;
        updateDisplay();
    }
}

// Keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        appendToDisplay(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        if (!waitingForOperand) {
            previousInput = currentInput;
            operator = e.key;
            waitingForOperand = true;
        }
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});`
            },
            todo: {
                html: `<div class="todo-app">
    <div class="todo-header">
        <h2>📝 Task Manager Pro</h2>
        <div class="add-task">
            <input type="text" id="taskInput" placeholder="Add a new task...">
            <button onclick="addTask()">+</button>
        </div>
    </div>
    <div class="todo-filters">
        <button class="filter-btn active" onclick="filterTasks('all')">All</button>
        <button class="filter-btn" onclick="filterTasks('active')">Active</button>
        <button class="filter-btn" onclick="filterTasks('completed')">Completed</button>
    </div>
    <div class="todo-list" id="todoList"></div>
    <div class="todo-stats">
        <span id="taskCount">0 tasks remaining</span>
        <button onclick="clearCompleted()">Clear Completed</button>
    </div>
</div>`,
                css: `.todo-app {
    max-width: 500px;
    margin: 20px auto;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    overflow: hidden;
}

.todo-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
}

.todo-header h2 {
    margin-bottom: 15px;
    text-align: center;
}

.add-task {
    display: flex;
    gap: 10px;
}

.add-task input {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
}

.add-task button {
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    color: white;
    width: 50px;
    border-radius: 8px;
    font-size: 24px;
    cursor: pointer;
}

.todo-filters {
    display: flex;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.filter-btn {
    flex: 1;
    background: none;
    border: none;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn.active, .filter-btn:hover {
    background: #667eea;
    color: white;
}

.todo-list {
    max-height: 400px;
    overflow-y: auto;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.todo-item:hover {
    background: #f8f9fa;
}

.todo-item.completed {
    opacity: 0.6;
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
}

.todo-checkbox {
    width: 20px;
    height: 20px;
    margin-right: 15px;
    cursor: pointer;
}

.todo-text {
    flex: 1;
    font-size: 16px;
}

.todo-delete {
    background: #f56565;
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.todo-item:hover .todo-delete {
    opacity: 1;
}

.todo-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #f8f9fa;
    font-size: 14px;
    color: #6c757d;
}

.todo-stats button {
    background: none;
    border: none;
    color: #f56565;
    cursor: pointer;
    font-size: 14px;
}`,
                js: `let tasks = [];
let currentFilter = 'all';

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(task);
        input.value = '';
        renderTasks();
        updateStats();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    updateStats();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
    updateStats();
}

function renderTasks() {
    const todoList = document.getElementById('todoList');
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    todoList.innerHTML = filteredTasks.map(task => \`
        <div class="todo-item \${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="todo-checkbox" \${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(\${task.id})">
            <span class="todo-text">\${task.text}</span>
            <button class="todo-delete" onclick="deleteTask(\${task.id})">🗑️</button>
        </div>
    \`).join('');
}

function updateStats() {
    const activeCount = tasks.filter(task => !task.completed).length;
    document.getElementById('taskCount').textContent = \`\${activeCount} task\${activeCount !== 1 ? 's' : ''} remaining\`;
}

// Add task on Enter key
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize with sample tasks
tasks = [
    { id: 1, text: 'Build amazing portfolio website', completed: true },
    { id: 2, text: 'Learn React.js and Node.js', completed: false },
    { id: 3, text: 'Master Data Structures & Algorithms', completed: false },
    { id: 4, text: 'Apply for internships', completed: false }
];

renderTasks();
updateStats();`
            },
            weather: {
                html: `<div class="weather-app">
    <div class="weather-search">
        <input type="text" id="cityInput" placeholder="Enter city name...">
        <button onclick="getWeather()">🔍</button>
        <button onclick="getCurrentLocation()" title="Get current location">📍</button>
    </div>
    <div class="weather-display" id="weatherDisplay">
        <div class="weather-loading">
            <div class="loading-spinner"></div>
            <p>Loading weather data...</p>
        </div>
    </div>
</div>`,
                css: `.weather-app {
    max-width: 400px;
    margin: 20px auto;
    background: linear-gradient(135deg, #74b9ff, #0984e3);
    border-radius: 20px;
    padding: 20px;
    color: white;
    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.weather-search {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.weather-search input {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 10px;
    background: rgba(255,255,255,0.2);
    color: white;
    backdrop-filter: blur(10px);
}

.weather-search input::placeholder {
    color: rgba(255,255,255,0.7);
}

.weather-search button {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    padding: 12px 15px;
    border-radius: 10px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.weather-search button:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}

.weather-display {
    text-align: center;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.weather-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.weather-info {
    animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.weather-city {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.weather-icon {
    font-size: 4rem;
    margin: 20px 0;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.weather-temp {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.weather-desc {
    font-size: 1.2rem;
    margin-bottom: 20px;
    text-transform: capitalize;
}

.weather-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-top: 20px;
}

.weather-detail {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 10px;
    backdrop-filter: blur(10px);
}

.weather-detail-label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 5px;
}

.weather-detail-value {
    font-size: 1.2rem;
    font-weight: bold;
}`,
                js: `const API_KEY = 'demo'; // Replace with actual API key
const weatherIcons = {
    'clear': '☀️',
    'clouds': '☁️',
    'rain': '🌧️',
    'snow': '❄️',
    'thunderstorm': '⛈️',
    'drizzle': '🌦️',
    'mist': '🌫️',
    'fog': '🌫️'
};

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;
    
    showLoading();
    
    // Simulate API call with demo data
    setTimeout(() => {
        const demoWeather = {
            name: city,
            main: {
                temp: Math.floor(Math.random() * 30) + 5,
                feels_like: Math.floor(Math.random() * 30) + 5,
                humidity: Math.floor(Math.random() * 50) + 30,
                pressure: Math.floor(Math.random() * 50) + 1000
            },
            weather: [{
                main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
                description: 'scattered clouds'
            }],
            wind: {
                speed: Math.floor(Math.random() * 10) + 1
            },
            visibility: Math.floor(Math.random() * 5000) + 5000
        };
        displayWeather(demoWeather);
    }, 1000);
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            position => {
                // Simulate getting weather for current location
                setTimeout(() => {
                    const demoWeather = {
                        name: 'Your Location',
                        main: {
                            temp: 24,
                            feels_like: 26,
                            humidity: 65,
                            pressure: 1013
                        },
                        weather: [{
                            main: 'Clear',
                            description: 'clear sky'
                        }],
                        wind: {
                            speed: 3.2
                        },
                        visibility: 10000
                    };
                    displayWeather(demoWeather);
                }, 1000);
            },
            error => {
                console.error('Error getting location:', error);
                showError('Unable to get your location');
            }
        );
    } else {
        showError('Geolocation is not supported by this browser');
    }
}

function showLoading() {
    document.getElementById('weatherDisplay').innerHTML = \`
        <div class="weather-loading">
            <div class="loading-spinner"></div>
            <p>Loading weather data...</p>
        </div>
    \`;
}

function displayWeather(data) {
    const weatherMain = data.weather[0].main.toLowerCase();
    const icon = weatherIcons[weatherMain] || '🌤️';
    
    document.getElementById('weatherDisplay').innerHTML = \`
        <div class="weather-info">
            <div class="weather-city">\${data.name}</div>
            <div class="weather-icon">\${icon}</div>
            <div class="weather-temp">\${Math.round(data.main.temp)}°C</div>
            <div class="weather-desc">\${data.weather[0].description}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-label">Feels like</div>
                    <div class="weather-detail-value">\${Math.round(data.main.feels_like)}°C</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Humidity</div>
                    <div class="weather-detail-value">\${data.main.humidity}%</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Wind Speed</div>
                    <div class="weather-detail-value">\${data.wind.speed} m/s</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Pressure</div>
                    <div class="weather-detail-value">\${data.main.pressure} hPa</div>
                </div>
            </div>
        </div>
    \`;
}

function showError(message) {
    document.getElementById('weatherDisplay').innerHTML = \`
        <div class="weather-error">
            <div style="font-size: 3rem; margin-bottom: 15px;">❌</div>
            <p>\${message}</p>
        </div>
    \`;
}

// Initialize with demo data for Delhi
setTimeout(() => {
    document.getElementById('cityInput').value = 'Delhi';
    getWeather();
}, 500);

// Add Enter key support
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});`
            },
            'color-palette': {
                html: `<div class="palette-app">
    <div class="palette-header">
        <h2>🎨 Color Palette Generator</h2>
        <div class="palette-controls">
            <button onclick="generatePalette()" class="generate-btn">Generate New</button>
            <select id="paletteType" onchange="generatePalette()">
                <option value="random">Random</option>
                <option value="analogous">Analogous</option>
                <option value="complementary">Complementary</option>
                <option value="triadic">Triadic</option>
                <option value="monochromatic">Monochromatic</option>
            </select>
        </div>
    </div>
    <div class="color-palette" id="colorPalette"></div>
    <div class="export-options">
        <button onclick="exportPalette('css')">Export CSS</button>
        <button onclick="exportPalette('json')">Export JSON</button>
        <button onclick="exportPalette('adobe')">Export Adobe ASE</button>
    </div>
</div>`,
                css: `.palette-app {
    max-width: 600px;
    margin: 20px auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    overflow: hidden;
}

.palette-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px;
    text-align: center;
}

.palette-header h2 {
    margin-bottom: 20px;
}

.palette-controls {
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
}

.generate-btn, #paletteType {
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    backdrop-filter: blur(10px);
}

.generate-btn:hover, #paletteType:hover {
    background: rgba(255,255,255,0.3);
}

.color-palette {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    min-height: 200px;
}

.color-swatch {
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
}

.color-swatch:hover {
    transform: scale(1.05);
    z-index: 10;
}

.color-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 15px;
    text-align: center;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.color-swatch:hover .color-info {
    transform: translateY(0);
}

.color-hex {
    font-family: monospace;
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.color-rgb, .color-hsl {
    font-size: 0.9rem;
    opacity: 0.9;
}

.copy-notification {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 0.9rem;
    opacity: 0;
    animation: copyNotif 1.5s ease;
}

@keyframes copyNotif {
    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.export-options {
    padding: 20px;
    display: flex;
    gap: 10px;
    justify-content: center;
    background: #f8f9fa;
}

.export-options button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.export-options button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}`,
                js: `let currentPalette = [];

function generatePalette() {
    const type = document.getElementById('paletteType').value;
    const baseHue = Math.floor(Math.random() * 360);
    
    switch(type) {
        case 'analogous':
            currentPalette = generateAnalogous(baseHue);
            break;
        case 'complementary':
            currentPalette = generateComplementary(baseHue);
            break;
        case 'triadic':
            currentPalette = generateTriadic(baseHue);
            break;
        case 'monochromatic':
            currentPalette = generateMonochromatic(baseHue);
            break;
        default:
            currentPalette = generateRandom();
    }
    
    displayPalette();
}

function generateRandom() {
    return Array.from({length: 5}, () => ({
        hue: Math.floor(Math.random() * 360),
        saturation: Math.floor(Math.random() * 40) + 40,
        lightness: Math.floor(Math.random() * 40) + 30
    }));
}

function generateAnalogous(baseHue) {
    return Array.from({length: 5}, (_, i) => ({
        hue: (baseHue + i * 30) % 360,
        saturation: Math.floor(Math.random() * 20) + 60,
        lightness: Math.floor(Math.random() * 30) + 40
    }));
}

function generateComplementary(baseHue) {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        const hue = i < 3 ? baseHue : (baseHue + 180) % 360;
        colors.push({
            hue: hue + (Math.random() * 20 - 10),
            saturation: Math.floor(Math.random() * 30) + 50,
            lightness: Math.floor(Math.random() * 40) + 30
        });
    }
    return colors;
}

function generateTriadic(baseHue) {
    const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
    return Array.from({length: 5}, (_, i) => ({
        hue: hues[i % 3] + (Math.random() * 20 - 10),
        saturation: Math.floor(Math.random() * 30) + 50,
        lightness: Math.floor(Math.random() * 40) + 30
    }));
}

function generateMonochromatic(baseHue) {
    return Array.from({length: 5}, (_, i) => ({
        hue: baseHue,
        saturation: Math.floor(Math.random() * 20) + 50,
        lightness: 20 + i * 15
    }));
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    
    if (h < 1/6) {
        [r, g, b] = [c, x, 0];
    } else if (h < 2/6) {
        [r, g, b] = [x, c, 0];
    } else if (h < 3/6) {
        [r, g, b] = [0, c, x];
    } else if (h < 4/6) {
        [r, g, b] = [0, x, c];
    } else if (h < 5/6) {
        [r, g, b] = [x, 0, c];
    } else {
        [r, g, b] = [c, 0, x];
    }
    
    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function displayPalette() {
    const paletteContainer = document.getElementById('colorPalette');
    
    paletteContainer.innerHTML = currentPalette.map((color, index) => {
        const [r, g, b] = hslToRgb(color.hue, color.saturation, color.lightness);
        const hex = rgbToHex(r, g, b);
        const hsl = \`hsl(\${Math.round(color.hue)}, \${Math.round(color.saturation)}%, \${Math.round(color.lightness)}%)\`;
        const rgb = \`rgb(\${r}, \${g}, \${b})\`;
        
        return \`
            <div class="color-swatch" style="background-color: \${hex}" onclick="copyColor('\${hex}')">
                <div class="color-info">
                    <div class="color-hex">\${hex}</div>
                    <div class="color-rgb">\${rgb}</div>
                    <div class="color-hsl">\${hsl}</div>
                </div>
            </div>
        \`;
    }).join('');
}

function copyColor(color) {
    navigator.clipboard.writeText(color).then(() => {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Copied!';
        event.target.closest('.color-swatch').appendChild(notification);
        
        setTimeout(() => notification.remove(), 1500);
    });
}

function exportPalette(format) {
    let exportData = '';
    
    switch(format) {
        case 'css':
            exportData = ':root {\\n';
            currentPalette.forEach((color, index) => {
                const [r, g, b] = hslToRgb(color.hue, color.saturation, color.lightness);
                const hex = rgbToHex(r, g, b);
                exportData += \`  --color-\${index + 1}: \${hex};\\n\`;
            });
            exportData += '}';
            break;
            
        case 'json':
            exportData = JSON.stringify(currentPalette.map((color, index) => {
                const [r, g, b] = hslToRgb(color.hue, color.saturation, color.lightness);
                return {
                    name: \`Color \${index + 1}\`,
                    hex: rgbToHex(r, g, b),
                    rgb: {r, g, b},
                    hsl: {h: color.hue, s: color.saturation, l: color.lightness}
                };
            }), null, 2);
            break;
            
        case 'adobe':
            exportData = 'Adobe ASE format not implemented in demo';
            break;
    }
    
    const blob = new Blob([exportData], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`palette.\${format === 'adobe' ? 'ase' : format}\`;
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize with a random palette
generatePalette();`
            },
            'typing-test': {
                html: `<div class="typing-app">
    <div class="typing-header">
        <h2>⌨️ Typing Speed Test</h2>
        <div class="typing-stats">
            <div class="stat">
                <span class="stat-label">WPM</span>
                <span class="stat-value" id="wpm">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">Accuracy</span>
                <span class="stat-value" id="accuracy">100%</span>
            </div>
            <div class="stat">
                <span class="stat-label">Time</span>
                <span class="stat-value" id="timer">60s</span>
            </div>
        </div>
    </div>
    <div class="typing-content">
        <div class="text-display" id="textDisplay"></div>
        <textarea id="typingInput" placeholder="Click here and start typing..." disabled></textarea>
        <div class="typing-controls">
            <button onclick="startTest()" id="startBtn">Start Test</button>
            <button onclick="resetTest()" id="resetBtn">Reset</button>
            <select id="timeSelect">
                <option value="30">30 seconds</option>
                <option value="60" selected>60 seconds</option>
                <option value="120">2 minutes</option>
            </select>
        </div>
    </div>
    <div class="results" id="results" style="display: none;"></div>
</div>`,
                css: `.typing-app {
    max-width: 800px;
    margin: 20px auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    overflow: hidden;
}

.typing-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px;
    text-align: center;
}

.typing-header h2 {
    margin-bottom: 20px;
}

.typing-stats {
    display: flex;
    justify-content: center;
    gap: 40px;
}

.stat {
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 5px;
}

.stat-value {
    display: block;
    font-size: 2rem;
    font-weight: bold;
}

.typing-content {
    padding: 30px;
}

.text-display {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    padding: 25px;
    font-size: 1.2rem;
    line-height: 1.8;
    margin-bottom: 20px;
    min-height: 120px;
    font-family: 'Georgia', serif;
}

.char {
    position: relative;
}

.char.correct {
    background-color: #d4edda;
    color: #155724;
}

.char.incorrect {
    background-color: #f8d7da;
    color: #721c24;
}

.char.current {
    background-color: #667eea;
    color: white;
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
}

#typingInput {
    width: 100%;
    min-height: 100px;
    padding: 20px;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    font-size: 1.1rem;
    resize: vertical;
    font-family: 'Georgia', serif;
    line-height: 1.6;
}

#typingInput:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.typing-controls {
    display: flex;
    gap: 15px;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
}

.typing-controls button, .typing-controls select {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.typing-controls button:hover, .typing-controls select:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.typing-controls button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.results {
    background: #f8f9fa;
    padding: 30px;
    text-align: center;
}

.results h3 {
    color: #2d3748;
    margin-bottom: 20px;
}

.final-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.final-stat {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.final-stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 5px;
}

.final-stat-label {
    color: #4a5568;
    font-size: 0.9rem;
}`,
                js: `let testTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
    "In the world of technology, programming languages like JavaScript, Python, and Java have revolutionized how we build applications and solve complex problems.",
    "Machine learning and artificial intelligence are transforming industries by enabling computers to learn from data and make intelligent decisions.",
    "Web development encompasses both frontend technologies like HTML, CSS, and JavaScript, as well as backend frameworks and databases.",
    "Data structures and algorithms form the foundation of computer science, helping developers write efficient and optimized code."
];

let currentText = '';
let currentIndex = 0;
let startTime = null;
let endTime = null;
let timeLimit = 60;
let timerInterval = null;
let isTestActive = false;
let errors = 0;
let totalTyped = 0;

function initializeTest() {
    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    currentIndex = 0;
    errors = 0;
    totalTyped = 0;
    startTime = null;
    endTime = null;
    
    displayText();
    updateStats();
    
    document.getElementById('typingInput').value = '';
    document.getElementById('typingInput').disabled = true;
    document.getElementById('results').style.display = 'none';
}

function displayText() {
    const textDisplay = document.getElementById('textDisplay');
    const inputValue = document.getElementById('typingInput').value;
    
    let html = '';
    for (let i = 0; i < currentText.length; i++) {
        let className = '';
        
        if (i < inputValue.length) {
            className = inputValue[i] === currentText[i] ? 'correct' : 'incorrect';
        } else if (i === inputValue.length) {
            className = 'current';
        }
        
        html += \`<span class="char \${className}">\${currentText[i]}</span>\`;
    }
    
    textDisplay.innerHTML = html;
}

function startTest() {
    isTestActive = true;
    startTime = Date.now();
    timeLimit = parseInt(document.getElementById('timeSelect').value);
    
    document.getElementById('typingInput').disabled = false;
    document.getElementById('typingInput').focus();
    document.getElementById('startBtn').disabled = true;
    
    timerInterval = setInterval(updateTimer, 100);
    
    // Add input event listener
    const input = document.getElementById('typingInput');
    input.addEventListener('input', handleInput);
}

function handleInput() {
    if (!isTestActive) return;
    
    const inputValue = document.getElementById('typingInput').value;
    totalTyped = inputValue.length;
    
    // Count errors
    errors = 0;
    for (let i = 0; i < inputValue.length && i < currentText.length; i++) {
        if (inputValue[i] !== currentText[i]) {
            errors++;
        }
    }
    
    displayText();
    updateStats();
    
    // Check if test is complete
    if (inputValue.length >= currentText.length) {
        endTest();
    }
}

function updateTimer() {
    if (!startTime) return;
    
    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, timeLimit - elapsed);
    
    document.getElementById('timer').textContent = Math.ceil(remaining) + 's';
    
    if (remaining <= 0) {
        endTest();
    }
}

function updateStats() {
    if (!startTime) {
        document.getElementById('wpm').textContent = '0';
        document.getElementById('accuracy').textContent = '100%';
        return;
    }
    
    const elapsed = (Date.now() - startTime) / 1000;
    const wordsTyped = totalTyped / 5; // Standard: 5 characters = 1 word
    const wpm = Math.round((wordsTyped / elapsed) * 60);
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    
    document.getElementById('wpm').textContent = wpm;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

function endTest() {
    isTestActive = false;
    endTime = Date.now();
    
    clearInterval(timerInterval);
    document.getElementById('typingInput').disabled = true;
    document.getElementById('startBtn').disabled = false;
    
    showResults();
}

function showResults() {
    const elapsed = (endTime - startTime) / 1000;
    const wordsTyped = totalTyped / 5;
    const wpm = Math.round((wordsTyped / elapsed) * 60);
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    const correctChars = totalTyped - errors;
    
    const resultsHtml = \`
        <h3>🎉 Test Complete!</h3>
        <div class="final-stats">
            <div class="final-stat">
                <div class="final-stat-value">\${wpm}</div>
                <div class="final-stat-label">Words per Minute</div>
            </div>
            <div class="final-stat">
                <div class="final-stat-value">\${accuracy}%</div>
                <div class="final-stat-label">Accuracy</div>
            </div>
            <div class="final-stat">
                <div class="final-stat-value">\${correctChars}</div>
                <div class="final-stat-label">Correct Characters</div>
            </div>
            <div class="final-stat">
                <div class="final-stat-value">\${errors}</div>
                <div class="final-stat-label">Errors</div>
            </div>
        </div>
        <p>Great job! \${getEncouragementMessage(wpm, accuracy)}</p>
    \`;
    
    document.getElementById('results').innerHTML = resultsHtml;
    document.getElementById('results').style.display = 'block';
}

function getEncouragementMessage(wpm, accuracy) {
    if (wpm >= 60 && accuracy >= 95) {
        return "Excellent typing skills! You're a typing master! 🚀";
    } else if (wpm >= 40 && accuracy >= 90) {
        return "Great job! You're well above average! 💪";
    } else if (wpm >= 25 && accuracy >= 85) {
        return "Good work! Keep practicing to improve further! 👍";
    } else {
        return "Keep practicing! Every expert was once a beginner! 🌟";
    }
}

function resetTest() {
    clearInterval(timerInterval);
    isTestActive = false;
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('timer').textContent = document.getElementById('timeSelect').value + 's';
    
    initializeTest();
}

// Initialize the test
initializeTest();`
            }
        };

        this.currentApp = 'calculator';
        this.editors = {};
        this.initializePlayground();
    }

    initializePlayground() {
        this.setupEventListeners();
        this.loadApp(this.currentApp);
        this.initializeCodeMirror();
    }

    setupEventListeners() {
        // App selector buttons
        document.querySelectorAll('.app-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.app-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentApp = e.target.dataset.app;
                this.loadApp(this.currentApp);
            });
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.code-editor').forEach(editor => editor.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(`${e.target.dataset.tab}-editor`).classList.add('active');
            });
        });

        // Control buttons
        document.querySelector('.run-btn').addEventListener('click', () => this.runCode());
        document.querySelector('.reset-btn').addEventListener('click', () => this.resetCode());
        document.querySelector('.fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
        document.querySelector('.share-btn').addEventListener('click', () => this.shareCode());

        // Showcase items
        document.querySelectorAll('.showcase-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const app = e.currentTarget.dataset.app;
                if (app) {
                    document.querySelectorAll('.app-btn').forEach(b => b.classList.remove('active'));
                    document.querySelector(`[data-app="${app}"]`).classList.add('active');
                    this.currentApp = app;
                    this.loadApp(app);
                }
            });
        });
    }

    initializeCodeMirror() {
        const commonOptions = {
            theme: 'material-darker',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            lineWrapping: true
        };

        this.editors.html = CodeMirror.fromTextArea(document.getElementById('html-editor'), {
            ...commonOptions,
            mode: 'xml',
            htmlMode: true
        });

        this.editors.css = CodeMirror.fromTextArea(document.getElementById('css-editor'), {
            ...commonOptions,
            mode: 'css'
        });

        this.editors.js = CodeMirror.fromTextArea(document.getElementById('js-editor'), {
            ...commonOptions,
            mode: 'javascript'
        });

        // Auto-run on code change
        Object.values(this.editors).forEach(editor => {
            editor.on('change', () => {
                if (this.autoRun) {
                    clearTimeout(this.autoRunTimer);
                    this.autoRunTimer = setTimeout(() => this.runCode(), 1000);
                }
            });
        });
    }

    loadApp(appName) {
        const app = this.apps[appName];
        if (!app) return;

        this.editors.html.setValue(app.html);
        this.editors.css.setValue(app.css);
        this.editors.js.setValue(app.js);

        this.runCode();
    }

    runCode() {
        const html = this.editors.html.getValue();
        const css = this.editors.css.getValue();
        const js = this.editors.js.getValue();

        const previewFrame = document.getElementById('preview-frame');
        const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;

        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>
                    try {
                        ${js}
                    } catch (error) {
                        console.error('JavaScript Error:', error);
                        document.body.innerHTML += '<div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 10px; border: 1px solid #f5c6cb;"><strong>Error:</strong> ' + error.message + '</div>';
                    }
                </script>
            </body>
            </html>
        `;

        previewDocument.open();
        previewDocument.write(fullHTML);
        previewDocument.close();
    }

    resetCode() {
        this.loadApp(this.currentApp);
    }

    toggleFullscreen() {
        const previewSection = document.querySelector('.preview-section');
        previewSection.classList.toggle('fullscreen');
        
        if (previewSection.classList.contains('fullscreen')) {
            document.querySelector('.fullscreen-btn').textContent = '⊡ Exit Fullscreen';
        } else {
            document.querySelector('.fullscreen-btn').textContent = '⛶ Fullscreen';
        }
    }

    shareCode() {
        const html = this.editors.html.getValue();
        const css = this.editors.css.getValue();
        const js = this.editors.js.getValue();

        const data = {
            app: this.currentApp,
            html: html,
            css: css,
            js: js
        };

        const encodedData = btoa(JSON.stringify(data));
        const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${encodedData}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            const btn = document.querySelector('.share-btn');
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => btn.textContent = originalText, 2000);
        });
    }

    loadSharedCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedData = urlParams.get('shared');
        
        if (sharedData) {
            try {
                const data = JSON.parse(atob(sharedData));
                this.currentApp = data.app;
                
                // Update UI
                document.querySelectorAll('.app-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.app === data.app);
                });

                this.editors.html.setValue(data.html);
                this.editors.css.setValue(data.css);
                this.editors.js.setValue(data.js);
                
                this.runCode();
            } catch (error) {
                console.error('Error loading shared code:', error);
            }
        }
    }
}

// Initialize playground when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const playground = new LivePlayground();
    
    // Load shared code if present
    playground.loadSharedCode();
    
    // Add CSS for fullscreen mode
    const style = document.createElement('style');
    style.textContent = `
        .preview-section.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1000;
            background: white;
        }
        
        .preview-section.fullscreen .preview-iframe {
            height: calc(100vh - 60px);
        }
    `;
    document.head.appendChild(style);
});
