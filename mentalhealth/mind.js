class MoodTracker {
    constructor() {
        // Check for user authentication first
        if (!localStorage.getItem('moodTrackerUser')) {
            window.location.href = 'login.html';
            return;
        }
        
        // Rest of your existing constructor code
        this.moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        this.chart = null;
        this.init();
    }
    // ... rest of your existing code


    init() {
        this.setupEventListeners();
        this.initializeChart();
        this.updateUI();
    }

    setupEventListeners() {
        // Mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.logMood(parseInt(btn.dataset.mood));
            });
        });

        // Export button
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportData());

        // Import button and file input
        document.getElementById('importBtn')?.addEventListener('click', () => {
            document.getElementById('importInput')?.click();
        });

        document.getElementById('importInput')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => this.importData(event.target.result);
                reader.readAsText(file);
            }
        });
    }

    logMood(moodValue) {
        const noteInput = document.querySelector('.note-input');
        const note = noteInput?.value.trim() || '';
        const entry = {
            mood: moodValue,
            note: note,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };

        this.moodHistory.push(entry);
        localStorage.setItem('moodHistory', JSON.stringify(this.moodHistory));
        
        if (noteInput) noteInput.value = '';
        this.updateUI();
        this.showNotification('Mood logged successfully! 👍');
        this.checkAchievements();
        // Emit custom event for suggestions
        const event = new CustomEvent('moodLogged', { detail: { moodValue } });
        document.dispatchEvent(event);
    }

    updateUI() {
        this.updateStats();
        this.updateHistory();
        this.updateChart();
        this.updateStreak();
    }

    updateStats() {
        const statsElement = document.getElementById('moodStats');
        if (!statsElement) return;

        if (this.moodHistory.length === 0) {
            statsElement.innerHTML = '<p>No mood data yet</p>';
            return;
        }

        const moods = this.moodHistory.map(entry => entry.mood);
        const avgMood = (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1);
        const moodCounts = moods.reduce((acc, mood) => {
            acc[mood] = (acc[mood] || 0) + 1;
            return acc;
        }, {});
        const mostCommonMood = Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1])[0][0];

        statsElement.innerHTML = `
            <p>Average Mood: ${avgMood} / 5</p>
            <p>Most Common Mood: ${this.getMoodEmoji(parseInt(mostCommonMood))}</p>
            <p>Total Entries: ${this.moodHistory.length}</p>
        `;
    }

    updateHistory() {
        const historyElement = document.getElementById('moodHistory');
        if (!historyElement) return;

        const historyHTML = this.moodHistory.slice(-5).reverse().map(entry => `
            <div class="history-item">
                <div class="d-flex justify-content-between align-items-center">
                    <span style="font-size: 1.5rem;">${this.getMoodEmoji(entry.mood)}</span>
                    <small class="text-muted">${new Date(entry.timestamp).toLocaleString()}</small>
                </div>
                ${entry.note ? `<p class="mt-2 mb-0 text-muted">${entry.note}</p>` : ''}
            </div>
        `).join('');
        
        historyElement.innerHTML = historyHTML || '<p>No mood entries yet</p>';
    }

    initializeChart() {
        const canvas = document.getElementById('moodChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Mood Level',
                    data: [],
                    borderColor: '#4169E1',
                    backgroundColor: 'rgba(65, 105, 225, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 1,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    updateChart() {
        if (!this.chart) return;

        const lastWeek = this.moodHistory.slice(-7);
        this.chart.data.labels = lastWeek.map(entry => 
            new Date(entry.timestamp).toLocaleDateString()
        );
        this.chart.data.datasets[0].data = lastWeek.map(entry => entry.mood);
        this.chart.update();
    }

    updateStreak() {
        const streakElement = document.getElementById('streakCount');
        if (!streakElement) return;
        
        const streak = this.calculateStreak();
        streakElement.textContent = streak;
    }

    calculateStreak() {
        let streak = 0;
        let currentDate = new Date().toLocaleDateString();
        
        for (let i = this.moodHistory.length - 1; i >= 0; i--) {
            const entryDate = this.moodHistory[i].date;
            if (entryDate === currentDate || this.isConsecutiveDay(entryDate, currentDate)) {
                streak++;
                currentDate = entryDate;
            } else {
                break;
            }
        }
        return streak;
    }

    isConsecutiveDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }

    getMoodEmoji(mood) {
        const emojis = ['😢', '😕', '😐', '🙂', '😄'];
        return emojis[mood - 1] || '😐';
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.5s reverse';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    checkAchievements() {
        const streak = this.calculateStreak();
        if (streak === 3) this.showNotification('Achievement: 3-day streak! 🎉');
        if (streak === 7) this.showNotification('Achievement: Week-long streak! 🌟');
        if (this.moodHistory.length === 1) this.showNotification('Achievement: First mood logged! 🎈');
    }

    exportData() {
        const dataStr = JSON.stringify(this.moodHistory, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-tracker-export-${new Date().toLocaleDateString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully! 📤');
    }

    importData(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            if (Array.isArray(data)) {
                this.moodHistory = data;
                localStorage.setItem('moodHistory', JSON.stringify(data));
                this.updateUI();
                this.showNotification('Data imported successfully! 📥');
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            this.showNotification('Error importing data! Please check the file format. ⚠️');
            console.error('Import error:', error);
        }
    }
}

// Initialize the app when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const moodTracker = new MoodTracker();
    
    // Handle window resize for chart responsiveness
    window.addEventListener('resize', () => {
        if (moodTracker.chart) {
            moodTracker.chart.resize();
        }
    });
});
class Suggestions {
    constructor() {
        this.init();
    }

    init() {
        // Listen for mood logging events
        document.addEventListener('moodLogged', (event) => {
            if (event.detail && typeof event.detail.moodValue === 'number') {
                this.showSuggestions(event.detail.moodValue);
            }
        });
    }

    getSuggestions(moodValue) {
        const suggestions = {
            1: { // Very Sad
                title: "We're here to help you feel better ❤️",
                tips: [
                    "Take a few deep breaths - try the 4-7-8 breathing technique",
                    "Call a friend or family member for support",
                    "Go for a short walk in nature",
                    "Listen to uplifting music",
                    "Try a quick 5-minute meditation",
                    "Write down three things you're grateful for",
                    "Consider speaking with a mental health professional"
                ],
                resources: [
                    "Crisis Helpline: 988",
                    "BetterHelp Online Counseling",
                    "Calm or Headspace meditation apps"
                ],
                activities: [
                    "Gentle stretching or yoga",
                    "Drawing or coloring",
                    "Writing in a journal",
                    "Taking a warm bath",
                    "Watching funny videos"
                ]
            },
            2: { // Sad
                title: "Let's work on lifting your spirits 🌅",
                tips: [
                    "Do something creative - draw, write, or craft",
                    "Watch a favorite funny video or movie",
                    "Take a relaxing shower or bath",
                    "Try some light exercise or stretching",
                    "Reach out to a friend",
                    "Practice self-care activities"
                ],
                resources: [
                    "7cups - Online Support Community",
                    "Mood-boosting playlist",
                    "Self-care activity ideas"
                ],
                activities: [
                    "Cook your favorite meal",
                    "Organize a small space",
                    "Call a loved one",
                    "Do a puzzle",
                    "Listen to a podcast"
                ]
            },
            3: { // Neutral
                title: "Let's make today even better! 🌟",
                tips: [
                    "Set a small achievable goal for today",
                    "Try something new or different",
                    "Plan something to look forward to",
                    "Take a short break to refresh",
                    "Connect with nature for a few minutes"
                ],
                resources: [
                    "Mindfulness exercises",
                    "Productivity tips",
                    "Goal-setting templates"
                ],
                activities: [
                    "Start a new book",
                    "Learn something new online",
                    "Try a new recipe",
                    "Rearrange your space",
                    "Start a new hobby"
                ]
            },
            4: { // Happy
                title: "Great to see you happy! Keep it going! 🌈",
                tips: [
                    "Share your positivity with others",
                    "Document what made you happy today",
                    "Plan something fun for tomorrow",
                    "Express gratitude to someone",
                    "Channel this energy into a hobby"
                ],
                resources: [
                    "Gratitude journal ideas",
                    "Happiness-boosting activities",
                    "Creative project inspiration"
                ],
                activities: [
                    "Start a creative project",
                    "Send thank you messages",
                    "Take photos of happy moments",
                    "Dance to your favorite music",
                    "Plan a future adventure"
                ]
            },
            5: { // Very Happy
                title: "Wonderful! Let's maintain this amazing energy! 🌟",
                tips: [
                    "Celebrate this moment!",
                    "Share your joy with loved ones",
                    "Take a photo to remember this feeling",
                    "Write down what contributed to this happiness",
                    "Use this energy for something creative"
                ],
                resources: [
                    "Ways to preserve positive moments",
                    "Creative project ideas",
                    "Gratitude practice guides"
                ],
                activities: [
                    "Start a happiness journal",
                    "Plan a celebration",
                    "Create something",
                    "Share your success story",
                    "Set new exciting goals"
                ]
            }
        };

        return suggestions[moodValue] || suggestions[3]; // Default to neutral suggestions
    }

    showSuggestions(moodValue) {
        const suggestions = this.getSuggestions(moodValue);
        const container = document.querySelector('.chart-container');
        if (!container) return;

        const suggestionDiv = this.createSuggestionElement(suggestions);
        
        // Remove existing suggestions if any
        const existingSuggestions = document.querySelector('.suggestions-card');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        // Insert new suggestions after the chart
        container.after(suggestionDiv);

        // Add animation
        suggestionDiv.style.animation = 'fadeIn 0.5s ease-in-out';

        // Add interaction handlers
        this.addInteractionHandlers(suggestionDiv);
    }

    createSuggestionElement(suggestions) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestions-card';
        
        suggestionDiv.innerHTML = `
            <div class="p-4 bg-white rounded-lg shadow-lg mb-4">
                <h3 class="text-xl font-bold mb-3">${suggestions.title}</h3>
                
                <div class="tips-container">
                    <h4 class="font-semibold mb-2">Suggested Actions:</h4>
                    <ul class="list-group suggestion-list">
                        ${suggestions.tips.map(tip => `
                            <li class="list-group-item border-0 mb-2 suggestion-item">
                                <span class="me-2">•</span>
                                <span class="suggestion-text">${tip}</span>
                                <button class="complete-btn" aria-label="Mark as complete">✓</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="activities-container mt-4">
                    <h4 class="font-semibold mb-2">Recommended Activities:</h4>
                    <ul class="list-group suggestion-list">
                        ${suggestions.activities.map(activity => `
                            <li class="list-group-item border-0 mb-2 suggestion-item">
                                <span class="me-2">🎯</span>
                                <span class="suggestion-text">${activity}</span>
                                <button class="complete-btn" aria-label="Mark as complete">✓</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="resources-container mt-4">
                    <h4 class="font-semibold mb-2">Helpful Resources:</h4>
                    <ul class="list-group">
                        ${suggestions.resources.map(resource => `
                            <li class="list-group-item border-0 mb-2">
                                <span class="me-2">📌</span>${resource}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;

        return suggestionDiv;
    }

    addInteractionHandlers(suggestionDiv) {
        // Add click handlers for complete buttons
        const completeButtons = suggestionDiv.querySelectorAll('.complete-btn');
        completeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const item = e.target.closest('.suggestion-item');
                if (item) {
                    item.classList.toggle('completed');
                    if (item.classList.contains('completed')) {
                        this.showCompletionNotification();
                    }
                }
            });
        });

        // Add hover effects for suggestion items
        const suggestionItems = suggestionDiv.querySelectorAll('.suggestion-item');
        suggestionItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.classList.add('hover');
            });
            item.addEventListener('mouseleave', () => {
                item.classList.remove('hover');
            });
        });
    }

    showCompletionNotification() {
        const notification = document.createElement('div');
        notification.className = 'notification completion-notification';
        notification.textContent = '🎉 Great job completing this suggestion!';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in-out';
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
}

// Initialize Suggestions when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new Suggestions();
});
// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Display user info
    const userData = JSON.parse(localStorage.getItem('moodTrackerUser'));
    if (userData) {
        document.getElementById('userNameDisplay').textContent = `Welcome, ${userData.fullName}!`;
    }

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('moodTrackerUser');
        window.location.href = 'login.html';
    });

    // Your existing initialization
    const moodTracker = new MoodTracker();
    
    window.addEventListener('resize', () => {
        if (moodTracker.chart) {
            moodTracker.chart.resize();
        }
    });
});


