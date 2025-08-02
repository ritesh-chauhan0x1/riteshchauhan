class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('gameOverlay');
        
        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameLoop = null;
        this.soundEnabled = true;
        
        // Snake
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.nextDirection = null;
        
        // Food
        this.food = { x: 15, y: 15 };
        this.specialFood = null;
        this.specialFoodTimer = 0;
        
        // Score and level
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.level = 1;
        this.gameSpeed = 150;
        this.difficulty = 'medium';
        
        // Achievements
        this.achievements = {
            firstFood: false,
            score50: false,
            score100: false,
            level5: false,
            length20: false,
            noWalls: false
        };
        
        this.loadAchievements();
        this.initGame();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initGame() {
        // Set canvas to retro style
        this.canvas.classList.add('crt-effect');
        
        // Create grid pattern
        this.drawGrid();
        
        // Initial draw
        this.drawSnake();
        this.drawFood();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning && e.code === 'Space') {
                this.startGame();
                return;
            }
            
            if (this.gameRunning) {
                this.handleKeyPress(e);
            }
        });

        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!this.gameRunning) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 30) this.changeDirection('right');
                else if (deltaX < -30) this.changeDirection('left');
            } else {
                // Vertical swipe
                if (deltaY > 30) this.changeDirection('down');
                else if (deltaY < -30) this.changeDirection('up');
            }
        });
    }

    handleKeyPress(e) {
        e.preventDefault();
        
        switch (e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.changeDirection('up');
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.changeDirection('down');
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.changeDirection('left');
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.changeDirection('right');
                break;
            case 'Space':
                this.togglePause();
                break;
            case 'KeyR':
                this.restartGame();
                break;
        }
    }

    changeDirection(direction) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const head = this.snake[0];
        
        switch (direction) {
            case 'up':
                if (this.dy !== 1) this.nextDirection = { dx: 0, dy: -1 };
                break;
            case 'down':
                if (this.dy !== -1) this.nextDirection = { dx: 0, dy: 1 };
                break;
            case 'left':
                if (this.dx !== 1) this.nextDirection = { dx: -1, dy: 0 };
                break;
            case 'right':
                if (this.dx !== -1) this.nextDirection = { dx: 1, dy: 0 };
                break;
        }
    }

    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.overlay.classList.add('hidden');
        
        // Reset if needed
        if (this.snake.length === 1 && this.score === 0) {
            this.resetGame();
        }
        
        this.gameLoop = setInterval(() => {
            if (!this.gamePaused) {
                this.update();
                this.draw();
            }
        }, this.gameSpeed);
        
        document.getElementById('pauseButton').textContent = 'Pause';
    }

    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseButton').textContent = this.gamePaused ? 'Resume' : 'Pause';
        
        if (this.gamePaused) {
            this.showOverlay('Game Paused', 'Press Space or Resume to continue');
        } else {
            this.overlay.classList.add('hidden');
        }
    }

    restartGame() {
        this.stopGame();
        this.resetGame();
        this.startGame();
    }

    stopGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    resetGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.nextDirection = null;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = this.getDifficultySpeed();
        this.generateFood();
        this.specialFood = null;
        this.specialFoodTimer = 0;
        this.updateDisplay();
    }

    update() {
        // Apply next direction
        if (this.nextDirection) {
            this.dx = this.nextDirection.dx;
            this.dy = this.nextDirection.dy;
            this.nextDirection = null;
        }
        
        // Move snake
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // Handle wall collision based on difficulty
        if (this.difficulty === 'easy') {
            // Wrap around walls
            if (head.x < 0) head.x = this.tileCount - 1;
            if (head.x >= this.tileCount) head.x = 0;
            if (head.y < 0) head.y = this.tileCount - 1;
            if (head.y >= this.tileCount) head.y = 0;
            
            // Check achievement
            if (this.score > 0) this.unlockAchievement('noWalls');
        } else {
            // Hit walls = game over
            if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
                this.gameOver();
                return;
            }
        }
        
        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood(false);
        } else if (this.specialFood && head.x === this.specialFood.x && head.y === this.specialFood.y) {
            this.eatFood(true);
        } else {
            this.snake.pop();
        }
        
        // Update special food timer
        if (this.specialFood) {
            this.specialFoodTimer--;
            if (this.specialFoodTimer <= 0) {
                this.specialFood = null;
            }
        } else if (Math.random() < 0.02) {
            // 2% chance per frame to spawn special food
            this.generateSpecialFood();
        }
        
        // Check achievements
        this.checkAchievements();
    }

    eatFood(isSpecial) {
        const points = isSpecial ? 20 : 10;
        this.score += points;
        
        // Show score popup
        this.showScorePopup(points, isSpecial);
        
        // Play sound
        this.playSound('eat');
        
        // Generate new food
        this.generateFood();
        
        if (isSpecial) {
            this.specialFood = null;
            this.specialFoodTimer = 0;
        }
        
        // Level up logic
        const newLevel = Math.floor(this.score / 50) + 1;
        if (newLevel > this.level) {
            this.levelUp(newLevel);
        }
        
        this.updateDisplay();
        
        // Achievement check
        if (this.score >= 10) this.unlockAchievement('firstFood');
    }

    levelUp(newLevel) {
        this.level = newLevel;
        this.gameSpeed = Math.max(50, this.gameSpeed - 10);
        
        // Restart game loop with new speed
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => {
                if (!this.gamePaused) {
                    this.update();
                    this.draw();
                }
            }, this.gameSpeed);
        }
        
        this.playSound('levelup');
        this.showLevelUpMessage(newLevel);
    }

    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    generateSpecialFood() {
        do {
            this.specialFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (
            this.snake.some(segment => segment.x === this.specialFood.x && segment.y === this.specialFood.y) ||
            (this.specialFood.x === this.food.x && this.specialFood.y === this.food.y)
        );
        
        this.specialFoodTimer = 300; // 5 seconds at 60fps
    }

    draw() {
        this.clearCanvas();
        this.drawGrid();
        this.drawFood();
        this.drawSnake();
        
        if (this.specialFood) {
            this.drawSpecialFood();
        }
    }

    clearCanvas() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = '#111';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }

    drawSnake() {
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#60efff';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 2,
                    segment.y * this.gridSize + 2,
                    this.gridSize - 4,
                    this.gridSize - 4
                );
                
                // Eyes
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 6,
                    segment.y * this.gridSize + 6,
                    3, 3
                );
                this.ctx.fillRect(
                    segment.x * this.gridSize + 11,
                    segment.y * this.gridSize + 6,
                    3, 3
                );
            } else {
                // Body
                const intensity = 1 - (index / this.snake.length) * 0.5;
                this.ctx.fillStyle = `rgba(96, 239, 255, ${intensity})`;
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
            }
        });
    }

    drawFood() {
        // Apple emoji effect
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );
        
        // Highlight
        this.ctx.fillStyle = '#ff8888';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 4,
            this.food.y * this.gridSize + 4,
            4, 4
        );
    }

    drawSpecialFood() {
        const alpha = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        this.ctx.fillRect(
            this.specialFood.x * this.gridSize + 1,
            this.specialFood.y * this.gridSize + 1,
            this.gridSize - 2,
            this.gridSize - 2
        );
        
        // Star effect
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(
            this.specialFood.x * this.gridSize + 8,
            this.specialFood.y * this.gridSize + 8,
            4, 4
        );
    }

    gameOver() {
        this.stopGame();
        this.playSound('gameover');
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore.toString());
            this.showNewHighScore();
        }
        
        this.updateDisplay();
        this.showOverlay('Game Over', `Final Score: ${this.score}`);
        
        // Shake effect
        this.canvas.classList.add('shake');
        setTimeout(() => {
            this.canvas.classList.remove('shake');
        }, 500);
    }

    showOverlay(title, message) {
        document.getElementById('overlayTitle').textContent = title;
        document.getElementById('overlayMessage').textContent = message;
        document.getElementById('startButton').textContent = title === 'Game Over' ? 'Play Again' : 'Start Game';
        this.overlay.classList.remove('hidden');
    }

    showScorePopup(points, isSpecial) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${points}`;
        popup.style.color = isSpecial ? '#ffd700' : '#00ff87';
        
        const rect = this.canvas.getBoundingClientRect();
        popup.style.left = rect.left + Math.random() * rect.width + 'px';
        popup.style.top = rect.top + Math.random() * rect.height + 'px';
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    showLevelUpMessage(level) {
        const message = document.createElement('div');
        message.className = 'level-up';
        message.innerHTML = `
            <h2>Level Up!</h2>
            <p>Level ${level}</p>
            <p>Speed Increased!</p>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    showNewHighScore() {
        const message = document.createElement('div');
        message.className = 'level-up';
        message.innerHTML = `
            <h2>🎉 New High Score!</h2>
            <p>${this.highScore}</p>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
        document.getElementById('level').textContent = this.level;
    }

    changeDifficulty() {
        const select = document.getElementById('difficultySelect');
        this.difficulty = select.value;
        this.gameSpeed = this.getDifficultySpeed();
        
        if (this.gameRunning) {
            this.restartGame();
        }
    }

    getDifficultySpeed() {
        switch (this.difficulty) {
            case 'easy': return 200;
            case 'medium': return 150;
            case 'hard': return 100;
            case 'insane': return 60;
            default: return 150;
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        document.getElementById('soundButton').textContent = this.soundEnabled ? '🔊 Sound' : '🔇 Muted';
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Create simple beep sounds using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch (type) {
            case 'eat':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
            case 'levelup':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.4);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.6);
                break;
            case 'gameover':
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 1);
                break;
        }
    }

    checkAchievements() {
        if (this.score >= 50) this.unlockAchievement('score50');
        if (this.score >= 100) this.unlockAchievement('score100');
        if (this.level >= 5) this.unlockAchievement('level5');
        if (this.snake.length >= 20) this.unlockAchievement('length20');
    }

    unlockAchievement(achievement) {
        if (this.achievements[achievement]) return;
        
        this.achievements[achievement] = true;
        this.saveAchievements();
        
        const achievementElement = document.querySelector(`[data-achievement="${achievement}"]`);
        if (achievementElement) {
            achievementElement.classList.remove('locked');
            achievementElement.classList.add('unlocked');
            
            // Show unlock animation
            const unlockMessage = document.createElement('div');
            unlockMessage.className = 'level-up';
            unlockMessage.innerHTML = `
                <h2>🏆 Achievement Unlocked!</h2>
                <p>${achievementElement.querySelector('.text').textContent}</p>
            `;
            
            document.body.appendChild(unlockMessage);
            
            setTimeout(() => {
                unlockMessage.remove();
            }, 3000);
        }
    }

    saveAchievements() {
        localStorage.setItem('snakeAchievements', JSON.stringify(this.achievements));
    }

    loadAchievements() {
        const saved = localStorage.getItem('snakeAchievements');
        if (saved) {
            this.achievements = { ...this.achievements, ...JSON.parse(saved) };
        }
        
        // Update UI
        Object.keys(this.achievements).forEach(achievement => {
            if (this.achievements[achievement]) {
                const element = document.querySelector(`[data-achievement="${achievement}"]`);
                if (element) {
                    element.classList.remove('locked');
                    element.classList.add('unlocked');
                }
            }
        });
    }
}

// Global functions for HTML onclick handlers
function startGame() {
    window.snakeGame.startGame();
}

function togglePause() {
    window.snakeGame.togglePause();
}

function restartGame() {
    window.snakeGame.restartGame();
}

function toggleSound() {
    window.snakeGame.toggleSound();
}

function changeDifficulty() {
    window.snakeGame.changeDifficulty();
}

function changeDirection(direction) {
    window.snakeGame.changeDirection(direction);
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.snakeGame = new SnakeGame();
    
    // Add some fun loading messages
    const loadingMessages = [
        "Preparing the snake pit...",
        "Growing digital apples...",
        "Calculating optimal slithering paths...",
        "Loading retro vibes...",
        "Activating hunger mode..."
    ];
    
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    document.getElementById('overlayMessage').textContent = randomMessage;
    
    setTimeout(() => {
        document.getElementById('overlayMessage').textContent = "Use WASD or Arrow Keys to move";
    }, 2000);
});
