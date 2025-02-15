// script.js
const workouts = {
    strength: [
      { name: "Push-ups", gif: "pushups.gif", duration: 60 },
      { name: "Squats", gif: "squats.gif", duration: 45 },
      { name: "Dumbbell Workouts", gif: "dumbbell.gif", duration: 90 },
    ],
    cardio: [
      { name: "Jump Rope", gif: "jumprope.gif", duration: 120 },
      { name: "Running", gif: "running.gif", duration: 180 },
      { name: "HIIT", gif: "hiit.gif", duration: 60 },
    ],
    yoga: [
      { name: "Sun Salutation", gif: "sunsalutation.gif", duration: 90 },
      { name: "Shoulder Stretch", gif: "shoulderstretch.gif", duration: 60 },
    ],
    home: [
      { name: "Plank", gif: "plank.gif", duration: 30 },
      { name: "Lunges", gif:"lunges.gif", duration: 60 },
    ],
  };
  
  const workoutList = document.getElementById("workout-list");
  const buttons = document.querySelectorAll(".category-btn");
  
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      displayWorkouts(category);
    });
  });
  
  function displayWorkouts(category) {
    workoutList.innerHTML = ""; // Clear previous workouts
    const selectedWorkouts = workouts[category];
  
    selectedWorkouts.forEach((workout) => {
      const workoutItem = document.createElement("div");
      workoutItem.classList.add("workout-item");
  
      const workoutImage = document.createElement("img");
      workoutImage.src = `gifs/${workout.gif}`;
      workoutImage.alt = workout.name;
  
      const workoutName = document.createElement("h3");
      workoutName.textContent = workout.name;
  
      const timerInput = document.createElement("input");
      timerInput.type = "number";
      timerInput.classList.add("timer-input");
      timerInput.value = workout.duration;
      timerInput.min = 1;
  
      const startButton = document.createElement("button");
      startButton.classList.add("start-timer-btn");
      startButton.textContent = "Start Timer";
  
      const stopButton = document.createElement("button");
      stopButton.classList.add("stop-timer-btn");
      stopButton.textContent = "Stop Timer";
      stopButton.disabled = true;
  
      const timerDisplay = document.createElement("div");
      timerDisplay.classList.add("timer");
      timerDisplay.textContent = `Time: ${workout.duration}s`;
  
      const message = document.createElement("div");
      message.classList.add("message");
  
      let interval;
      let timeLeft = workout.duration;
  
      startButton.addEventListener("click", () => {
        if (interval) {
          message.textContent = "Timer is already running. Stop it first.";
          return;
        }
        timeLeft = parseInt(timerInput.value);
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        message.textContent = "";
        startButton.disabled = true;
        stopButton.disabled = false;
        interval = setInterval(() => {
          if (timeLeft <= 0) {
            clearInterval(interval);
            interval = null;
            timerDisplay.textContent = "Time's up!";
            startButton.disabled = false;
            stopButton.disabled = true;
          } else {
            timerDisplay.textContent = `Time: ${timeLeft}s`;
            timeLeft--;
          }
        }, 1000);
      });
  
      stopButton.addEventListener("click", () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
          timerDisplay.textContent = `Time: ${timeLeft}s`;
          startButton.disabled = false;
          stopButton.disabled = true;
          message.textContent = "";
        }
      });
  
      workoutItem.appendChild(workoutImage);
      workoutItem.appendChild(workoutName);
      workoutItem.appendChild(timerInput);
      workoutItem.appendChild(startButton);
      workoutItem.appendChild(stopButton);
      workoutItem.appendChild(timerDisplay);
      workoutItem.appendChild(message);
  
      workoutList.appendChild(workoutItem);
    });
  }
  // health.js 
// Keeping the existing workouts object and workout display functionality...

// Tab Switching Functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize tab functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Custom Workout Builder
  const customExercises = [];
  const addExerciseBtn = document.getElementById('addExercise');
  const exerciseList = document.getElementById('customExerciseList');

  if (addExerciseBtn) {
    addExerciseBtn.addEventListener('click', () => {
      const exercise = document.getElementById('exerciseSelect').value;
      const sets = document.getElementById('exerciseSets').value;
      const reps = document.getElementById('exerciseReps').value;

      if (exercise && sets && reps) {
        customExercises.push({ exercise, sets, reps });
        updateExerciseList();
        // Reset inputs
        document.getElementById('exerciseSelect').value = '';
        document.getElementById('exerciseSets').value = '';
        document.getElementById('exerciseReps').value = '';
      }
    });
  }

  function updateExerciseList() {
    if (!exerciseList) return;
    exerciseList.innerHTML = '';
    
    customExercises.forEach((exercise, index) => {
      const li = document.createElement('li');
      li.className = 'exercise-item';
      li.innerHTML = `
        <span>${exercise.exercise} - ${exercise.sets} sets x ${exercise.reps} reps</span>
        <button class="btn btn-danger btn-sm" onclick="removeExercise(${index})">Remove</button>
      `;
      exerciseList.appendChild(li);
    });
  }

  // Make removeExercise globally available
  window.removeExercise = function(index) {
    customExercises.splice(index, 1);
    updateExerciseList();
  };

  // Progress Photos
  const beforePhotoInput = document.getElementById('beforePhoto');
  const afterPhotoInput = document.getElementById('afterPhoto');

  if (beforePhotoInput) {
    beforePhotoInput.addEventListener('change', function(e) {
      handleImageUpload(e, 'beforePreview', 'beforeDate');
    });
  }

  if (afterPhotoInput) {
    afterPhotoInput.addEventListener('change', function(e) {
      handleImageUpload(e, 'afterPreview', 'afterDate');
    });
  }

  function handleImageUpload(event, previewId, dateId) {
    const file = event.target.files[0];
    const preview = document.getElementById(previewId);
    const dateDisplay = document.getElementById(dateId);
    
    if (file && preview && dateDisplay) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        dateDisplay.textContent = new Date().toLocaleDateString();
      };
      reader.readAsDataURL(file);
    }
  }

  // Daily Goals
  const goals = [];
  const addGoalBtn = document.getElementById('addGoal');
  const goalsList = document.getElementById('goalsList');

  if (addGoalBtn) {
    addGoalBtn.addEventListener('click', () => {
      const goalText = document.getElementById('goalInput').value;
      const goalTarget = document.getElementById('goalTarget').value;

      if (goalText && goalTarget) {
        goals.push({
          text: goalText,
          target: parseInt(goalTarget),
          current: 0
        });
        updateGoalsList();
        // Reset inputs
        document.getElementById('goalInput').value = '';
        document.getElementById('goalTarget').value = '';
      }
    });
  }

  function updateGoalsList() {
    if (!goalsList) return;
    goalsList.innerHTML = '';

    goals.forEach((goal, index) => {
      const progress = (goal.current / goal.target) * 100;
      
      const div = document.createElement('div');
      div.className = 'goal-item';
      div.innerHTML = `
        <div style="flex-grow: 1;">
          <div class="d-flex justify-content-between">
            <span>${goal.text}</span>
            <span>${goal.current}/${goal.target}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>
        <div class="ms-3">
          <button class="btn btn-sm btn-primary" onclick="updateProgress(${index}, 1)">+</button>
          <button class="btn btn-sm btn-danger" onclick="updateProgress(${index}, -1)">-</button>
        </div>
      `;
      goalsList.appendChild(div);
    });
  }

  // Make updateProgress globally available
  window.updateProgress = function(index, change) {
    const goal = goals[index];
    goal.current = Math.max(0, Math.min(goal.target, goal.current + change));
    updateGoalsList();
  };
});