class WeightUIController {
    constructor(dataManager, uiDisplay) {
        this.dataManager = dataManager;
        this.uiDisplay = uiDisplay;
        this.updateInterval = null;
    }

    initialize() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupFormValidation();
        this.startAutoUpdate();
    }

    setupEventListeners() {
        // Weight form submission
        const weightForm = document.getElementById('weightForm');
        if (weightForm) {
            weightForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleWeightSubmission();
            });
        }

        // Goal form submission
        const goalForm = document.getElementById('goalForm');
        if (goalForm) {
            goalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleGoalSubmission();
            });
        }

        // Profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate();
            });
        }

        // Reset data button
        const resetButton = document.getElementById('resetData');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.handleDataReset());
        }

        // Export data button
        const exportButton = document.getElementById('exportData');
        if (exportButton) {
            exportButton.addEventListener('click', () => this.handleDataExport());
        }

        // Import data button and file input
        const importButton = document.getElementById('importData');
        const fileInput = document.getElementById('dataFile');
        if (importButton && fileInput) {
            importButton.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleDataImport(e));
        }
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[type="number"]');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => this.validateInput(e.target));
            });
        });
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        const min = parseFloat(input.getAttribute('min') || 0);
        const max = parseFloat(input.getAttribute('max') || Infinity);

        if (isNaN(value) || value < min || value > max) {
            input.setCustomValidity(`Please enter a value between ${min} and ${max}`);
        } else {
            input.setCustomValidity('');
        }
    }

    async loadInitialData() {
        const result = this.dataManager.loadStoredData();
        if (result.success) {
            this.updateAllDisplays();
        } else {
            this.uiDisplay.showAlert('Failed to load saved data', 'error');
        }
    }

    startAutoUpdate() {
        // Update displays every 5 minutes
        this.updateInterval = setInterval(() => {
            this.updateAllDisplays();
        }, 300000);
    }

    async handleWeightSubmission() {
        const weightInput = document.getElementById('currentWeight');
        const heightInput = document.getElementById('height');
        
        if (!weightInput || !heightInput) return;

        const result = this.dataManager.addWeightEntry(
            weightInput.value,
            heightInput.value
        );

        if (result.success) {
            this.updateAllDisplays();
            this.uiDisplay.showAlert('Weight updated successfully!', 'success');
            weightInput.value = '';
        } else {
            this.uiDisplay.showAlert(result.error, 'danger');
        }
    }

    async handleGoalSubmission() {
        const startWeight = document.getElementById('startWeight');
        const targetWeight = document.getElementById('targetWeight');
        
        if (!startWeight || !targetWeight) return;

        const result = this.dataManager.setWeightGoal(
            startWeight.value,
            targetWeight.value
        );

        if (result.success) {
            this.updateAllDisplays();
            this.uiDisplay.showAlert('Goal set successfully!', 'success');
        } else {
            this.uiDisplay.showAlert(result.error, 'danger');
        }
    }

    async handleProfileUpdate() {
        const profileData = this.gatherProfileData();
        if (!profileData) return;

        const calories = this.dataManager.calculateCalorieNeeds(
            profileData.weight,
            profileData.height,
            profileData.age,
            profileData.gender,
            profileData.activityLevel
        );

        const result = this.dataManager.updateProfile({
            ...profileData,
            dailyCalories: calories
        });

        if (result.success) {
            this.updateAllDisplays();
            this.uiDisplay.showAlert('Profile updated successfully!', 'success');
        } else {
            this.uiDisplay.showAlert(result.error, 'danger');
        }
    }

    gatherProfileData() {
        const weight = document.getElementById('profileWeight')?.value;
        const height = document.getElementById('profileHeight')?.value;
        const age = document.getElementById('profileAge')?.value;
        const gender = document.getElementById('profileGender')?.value;
        const activityLevel = document.getElementById('activityLevel')?.value;

        if (!weight || !height || !age || !gender || !activityLevel) {
            this.uiDisplay.showAlert('Please fill in all profile fields', 'warning');
            return null;
        }

        return {
            weight: parseFloat(weight),
            height: parseFloat(height),
            age: parseInt(age),
            gender,
            activityLevel
        };
    }

    async handleDataReset() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            const result = this.dataManager.resetData();
            if (result.success) {
                this.updateAllDisplays();
                this.uiDisplay.showAlert('All data has been reset', 'success');
            } else {
                this.uiDisplay.showAlert('Failed to reset data', 'error');
            }
        }
    }

    async handleDataExport() {
        const data = this.dataManager.exportData();
        if (data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `weight-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.uiDisplay.showAlert('Data exported successfully!', 'success');
        } else {
            this.uiDisplay.showAlert('Failed to export data', 'error');
        }
    }

    async handleDataImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const result = this.dataManager.importData(data);
                if (result.success) {
                    this.updateAllDisplays();
                    this.uiDisplay.showAlert('Data imported successfully!', 'success');
                } else {
                    this.uiDisplay.showAlert(result.error, 'error');
                }
            } catch (error) {
                this.uiDisplay.showAlert('Invalid import file format', 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }

    updateAllDisplays() {
        const data = this.dataManager.getAllData();
        this.uiDisplay.updateWeightChart(data.weightEntries);
        this.uiDisplay.updateGoalProgress(data.goalData);
        this.uiDisplay.updateStats(data.stats);
        this.uiDisplay.updateProfileDisplay(data.profile);
    }

    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}
// WeightUIDisplay.js
class WeightUIDisplay {
    constructor() {
        this.chart = null;
        this.displayElements = {
            progress: document.getElementById('progressDisplay'),
            goals: document.getElementById('goalDisplay'),
            recommendations: document.getElementById('recommendationsDisplay'),
            calories: document.getElementById('calorieDisplay'),
            alerts: document.getElementById('alertContainer')
        };
    }

    setupChart() {
        const ctx = document.getElementById('weightChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Weight Progress',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.1,
                    fill: true
                }, {
                    label: 'Target Weight',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5],
                    tension: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weight Progress Over Time',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} kg`;
                            }
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Weight (kg)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear'
                    }
                }
            }
        });
    }

    updateChart(weightData, targetWeight) {
        const dates = weightData.map(entry => new Date(entry.date).toLocaleDateString());
        const weights = weightData.map(entry => entry.weight);
        const targetLine = new Array(dates.length).fill(targetWeight);

        this.chart.data.labels = dates;
        this.chart.data.datasets[0].data = weights;
        this.chart.data.datasets[1].data = targetLine;
        this.chart.update();
    }

    displayProgress(progressData) {
        if (!this.displayElements.progress) return;

        const trendIcon = progressData.weeklyChange < 0 ? '↓' : '↑';
        const trendClass = progressData.isHealthyRate ? 'text-success' : 'text-warning';

        this.displayElements.progress.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">Progress Update</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="progress-stat">
                                <h6>Current Weight</h6>
                                <p class="h3 mb-0">${progressData.currentWeight.toFixed(1)} kg</p>
                            </div>
                            <div class="progress-stat mt-3">
                                <h6>Weekly Change</h6>
                                <p class="h4 mb-0 ${trendClass}">
                                    ${trendIcon} ${Math.abs(progressData.weeklyChange).toFixed(1)} kg
                                </p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="progress-stat">
                                <h6>Current BMI</h6>
                                <p class="h3 mb-0">${progressData.currentBMI.toFixed(1)}</p>
                                ${this.getBMICategory(progressData.currentBMI)}
                            </div>
                            <div class="progress-stat mt-3">
                                <h6>Total Progress</h6>
                                <div class="progress" style="height: 20px;">
                                    <div class="progress-bar" role="progressbar" 
                                         style="width: ${progressData.progressPercent}%">
                                        ${progressData.progressPercent.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ${this.getProgressAlert(progressData)}
                </div>
            </div>
        `;
    }

    getBMICategory(bmi) {
        let category, colorClass;
        if (bmi < 18.5) {
            category = 'Underweight';
            colorClass = 'text-warning';
        } else if (bmi < 25) {
            category = 'Normal';
            colorClass = 'text-success';
        } else if (bmi < 30) {
            category = 'Overweight';
            colorClass = 'text-warning';
        } else {
            category = 'Obese';
            colorClass = 'text-danger';
        }
        return `<small class="${colorClass}">${category}</small>`;
    }

    getProgressAlert(progressData) {
        if (!progressData.isHealthyRate) {
            return `
                <div class="alert alert-warning mt-3 mb-0">
                    <i class="fas fa-exclamation-triangle"></i>
                    Your current rate of change might be too rapid. Consider adjusting your approach
                    for sustainable, healthy progress.
                </div>
            `;
        }
        return `
            <div class="alert alert-success mt-3 mb-0">
                <i class="fas fa-check-circle"></i>
                You're maintaining a healthy rate of change. Keep up the good work!
            </div>
        `;
    }

    displayGoals(goalData) {
        if (!this.displayElements.goals) return;

        this.displayElements.goals.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">Weight Goal</h5>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="goal-stat text-center">
                                <h6>Target</h6>
                                <p class="h3 mb-0">${goalData.targetWeight} kg</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="goal-stat text-center">
                                <h6>Weekly Goal</h6>
                                <p class="h3 mb-0">${goalData.weeklyGoal.toFixed(1)} kg</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="goal-stat text-center">
                                <h6>Time Frame</h6>
                                <p class="h3 mb-0">${goalData.recommendedWeeks} weeks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    displayRecommendations(recommendations) {
        if (!this.displayElements.recommendations) return;

        this.displayElements.recommendations.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">Personalized Recommendations</h5>
                    
                    <div class="recommendation-section">
                        <h6 class="mt-3">
                            <i class="fas fa-utensils"></i> Nutrition Tips
                        </h6>
                        <ul class="list-unstyled">
                            ${recommendations.nutrition.map(tip => `
                                <li class="mb-2">
                                    <i class="fas fa-check text-success"></i> ${tip}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="recommendation-section">
                        <h6 class="mt-3">
                            <i class="fas fa-running"></i> Exercise Tips
                        </h6>
                        <ul class="list-unstyled">
                            ${recommendations.exercise.map(tip => `
                                <li class="mb-2">
                                    <i class="fas fa-check text-success"></i> ${tip}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    ${this.getAdjustmentSection(recommendations.adjustments)}
                </div>
            </div>
        `;
    }

    getAdjustmentSection(adjustments) {
        if (!adjustments || adjustments.length === 0) return '';

        return `
            <div class="recommendation-section">
                <h6 class="mt-3">
                    <i class="fas fa-exclamation-circle text-warning"></i> 
                    Suggested Adjustments
                </h6>
                <ul class="list-unstyled">
                    ${adjustments.map(adjustment => `
                        <li class="mb-2">
                            <i class="fas fa-arrow-right text-warning"></i> ${adjustment}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    showAlert(message, type = 'success', duration = 5000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        this.displayElements.alerts.appendChild(alertDiv);

        if (duration) {
            setTimeout(() => {
                alertDiv.remove();
            }, duration);
        }
    }
}

export default WeightUIDisplay;