let weightData = [];
let weightGoal = ''; // 'gain' or 'lose'

function updateWeight() {
    const currentWeight = parseFloat(document.getElementById('currentWeight').value);
    const targetWeight = parseFloat(document.getElementById('targetWeight').value);
    
    if (currentWeight && targetWeight) {
        // Determine weight goal
        weightGoal = currentWeight > targetWeight ? 'lose' : 'gain';
        
        // Add new weight entry with timestamp
        weightData.push({
            date: new Date().toLocaleDateString(),
            weight: currentWeight
        });
        
        // Update progress calculations
        calculateProgress(currentWeight, targetWeight);
        
        // Update recommendations based on goal
        updateRecommendations();
        
        // Clear inputs and show success message
        showWeightUpdateMessage(currentWeight);
    }
}

function calculateProgress(current, target) {
    const difference = Math.abs(current - target);
    const progress = ((1 - (difference / Math.abs(target))) * 100).toFixed(1);
    
    const progressMessage = `
        <div class="alert alert-info">
            <h5>Progress Update</h5>
            <p>Current Weight: ${current} kg</p>
            <p>Target Weight: ${target} kg</p>
            <p>Progress: ${progress}% towards your goal</p>
            <p>Difference: ${Math.abs(current - target).toFixed(1)} kg to go</p>
        </div>
    `;
    
    // Update progress display
    const progressDisplay = document.createElement('div');
    progressDisplay.innerHTML = progressMessage;
    document.querySelector('.weight-tracker').appendChild(progressDisplay);
}

const weightGainTips = [
    "Eat calorie-dense foods like nuts, avocados, and healthy oils",
    "Increase protein intake with lean meats, eggs, and legumes",
    "Add healthy carbs like whole grains, potatoes, and fruits",
    "Drink calories through smoothies and protein shakes",
    "Eat more frequently - aim for 6 smaller meals throughout the day"
];

const weightGainExercises = [
    "Compound exercises: squats, deadlifts, bench presses",
    "Progressive overload weight training",
    "Limit cardio to 20-30 minutes",
    "Focus on heavyweight, low-rep exercises",
    "Rest 2-3 minutes between sets for muscle recovery"
];

const weightLossTips = [
    "Create a caloric deficit of 500-750 calories per day",
    "Increase fiber intake through vegetables and whole grains",
    "Drink water before meals to reduce appetite",
    "Use smaller plates to control portions",
    "Track your calories using a food diary"
];

const weightLossExercises = [
    "Combine cardio with strength training",
    "High-Intensity Interval Training (HIIT)",
    "Regular brisk walking or jogging",
    "Circuit training with minimal rest between exercises",
    "Swimming or cycling for low-impact cardio"
];

function updateRecommendations() {
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = ''; // Clear existing tips
    
    const tips = weightGoal === 'gain' ? weightGainTips : weightLossTips;
    const exercises = weightGoal === 'gain' ? weightGainExercises : weightLossExercises;
    
    // Add nutrition tips
    const nutritionSection = document.createElement('div');
    nutritionSection.innerHTML = `
        <h4 class="mb-3">Nutrition Recommendations for ${weightGoal === 'gain' ? 'Weight Gain' : 'Weight Loss'}</h4>
        ${tips.map(tip => `<div class="tip-card mb-2">${tip}</div>`).join('')}
    `;
    tipsList.appendChild(nutritionSection);
    
    // Add exercise tips
    const exerciseSection = document.createElement('div');
    exerciseSection.innerHTML = `
        <h4 class="mt-4 mb-3">Exercise Recommendations</h4>
        ${exercises.map(exercise => `<div class="tip-card mb-2">${exercise}</div>`).join('')}
    `;
    tipsList.appendChild(exerciseSection);
}

function showWeightUpdateMessage(weight) {
    const message = document.createElement('div');
    message.className = 'alert alert-success alert-dismissible fade show mt-3';
    message.innerHTML = `
        <strong>Weight Updated!</strong> Your current weight of ${weight} kg has been recorded.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.weight-tracker').appendChild(message);
}

// Initialize recommendations on page load
document.addEventListener('DOMContentLoaded', () => {
    const weightForm = document.querySelector('.weight-tracker');
    weightForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateWeight();
    });
});