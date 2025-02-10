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
      { name: "Lunges", gif: "lunges.gif", duration: 60 },
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