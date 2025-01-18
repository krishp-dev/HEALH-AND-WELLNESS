// Doctor availability data
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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointmentForm');
    const doctorSelect = document.getElementById('doctorSelect');
    const appointmentDate = document.getElementById('appointmentDate');
    const confirmationMessage = document.getElementById('confirmationMessage');

   

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (appointmentDate) {
        appointmentDate.min = tomorrow.toISOString().split('T')[0];
    }

    function getDayName(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    function showMessage(message, isError = false) {
        if (confirmationMessage) {
            confirmationMessage.textContent = message;
            confirmationMessage.style.display = 'block';
            confirmationMessage.className = 'alert mt-3';
            if (isError) {
                confirmationMessage.classList.add('alert-danger');
            } else {
                confirmationMessage.classList.add('alert-success');
            }
        } else {
            alert(message);
        }
    }

    if (appointmentForm) {
        
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
           
            if (confirmationMessage) {
                confirmationMessage.style.display = 'none';
                
            }
            
            console.log("huii")
            const doctorKey = doctorSelect?.value;
            const selectedDate = appointmentDate?.value;
            console.log(doctorKey , selectedDate)
            if (!doctorKey || !selectedDate) {
                showMessage('Please select a doctor and a valid date.', true);
                return;
            }

            const doctor = doctors[doctorKey];
            const selectedDay = getDayName(selectedDate);

            console.log('Selected day:', selectedDay);
            console.log('Doctor availability:', doctor.availability);

            // Check if the selected day is within the doctor's availability
            if (!doctor.availability.includes(selectedDay)) {
                console.log("soryy")
                showMessage(`Sorry, ${doctor.name} is not available on ${selectedDay}s`, true);
                return;
            }

            // Show success message
            showMessage(`Appointment Confirmed! You've booked an appointment with ${doctor.name} on ${selectedDate}.`);
        });
    }
});