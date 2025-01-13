
const doctors = {
    smith: {
        name: 'Dr. John Smith',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    brown: {
        name: 'Dr. Emily Brown',
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    lee: {
        name: 'Dr. Michael Lee',
        availability: ['Tuesday', 'Wednesday', 'Thursday']
    }
};

const appointmentForm = document.getElementById('appointmentForm');
const doctorSelect = document.getElementById('doctorSelect');
const appointmentDate = document.getElementById('appointmentDate');
const confirmationMessage = document.getElementById('confirmationMessage');

// Set minimum date to tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
appointmentDate.min = tomorrow.toISOString().split('T')[0];

// Utility function to get the day name from a date
function getDayName(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const doctorKey = doctorSelect.value;
    const selectedDate = appointmentDate.value;

    if (!doctorKey || !selectedDate) {
        alert('Please select a doctor and a valid date.');
        return;
    }

    const doctor = doctors[doctorKey];
    const selectedDay = getDayName(selectedDate);

    // Check if the selected day is within the doctor's availability
    if (!doctor.availability.includes(selectedDay)) {
        confirmationMessage.style.display = "block";
        confirmationMessage.style.backgroundColor = "red"
        confirmationMessage.textContent = "Sorry,  ${doctor.name} is not available on ${selectedDate}"
        return;
    }

    // Display the confirmation message
    confirmationMessage.style.display = 'block';
    confirmationMessage.textContent = `Appointment Confirmed! You've booked an appointment with ${doctor.name} on ${selectedDate}.`;
});

