if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

const calendarCarousel = document.getElementById("calendarCarousel");

const today = new Date();
let selectedDate = new Date(today);

const savedProgress = localStorage.getItem("readingProgress");

const readingProgress = savedProgress
    ? JSON.parse(savedProgress)
    : {};

function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getReadingProgress(dateKey) {
    if (!readingProgress[dateKey]) {
        readingProgress[dateKey] = {
            morning: false,
            evening: false
        };
    }

    return readingProgress[dateKey];
}

function updateCalendarDay(dayCell) {
    const dateKey = dayCell.dataset.date;
    const dateProgress = readingProgress[dateKey];

    dayCell.classList.remove(
        "morning-completed",
        "evening-completed"
    );

    if (!dateProgress) {
        return;
    }

    if (dateProgress.morning) {
        dayCell.classList.add("morning-completed");
    }

    if (dateProgress.evening) {
        dayCell.classList.add("evening-completed");
    }
}

function updateReadingButtons() {
    const dateKey = getLocalDateKey(selectedDate);
    const dateProgress = getReadingProgress(dateKey);

    readingButtons.forEach((button) => {
        const isMorning = button.textContent.toLowerCase().includes("morning");
        const readingType = isMorning ? "morning" : "evening";
        const isCompleted = dateProgress[readingType];

        button.dataset.completed = String(isCompleted);

        if (isCompleted) {
            button.classList.add("reading-completed");
            button.textContent = isMorning
                ? "Morning reading completed ✓ — Undo"
                : "Evening reading completed ✓ — Undo";
        } else {
            button.classList.remove("reading-completed");
            button.textContent = isMorning
                ? "Mark morning as read"
                : "Mark evening as read";
        }
    });
}

const year = today.getFullYear();

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

for (let month = 0; month < 12; month++) {
    // Get the first day of this month
    const firstDay = new Date(year, month, 1);

    // Get the number of days in this month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the month's name
    const monthName = firstDay.toLocaleString("en-US", {
        month: "long"
    });

    // Create the month card
    const monthCard = document.createElement("div");
    monthCard.classList.add("calendar-month", "card", "p-4");
    monthCard.id = `month-${month}`;

    // Create the heading
    const heading = document.createElement("h2");
    heading.textContent = `${monthName} ${year}`;
    monthCard.appendChild(heading);

    // Create the calendar grid
    const calendarGrid = document.createElement("div");
    calendarGrid.classList.add("calendar-grid");

    // Add weekday headings
    weekdays.forEach(day => {
        const weekdayCell = document.createElement("div");
        weekdayCell.classList.add("weekday");
        weekdayCell.textContent = day;
        calendarGrid.appendChild(weekdayCell);
    });

    // Add empty cells before the first day
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement("div");
        calendarGrid.appendChild(emptyCell);
    }

    // Add the numbered days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("calendar-day");
        
        const dayNumber = document.createElement("span");
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);

        dayCell.dataset.date =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        dayCell.addEventListener("click", () => {

            document.querySelectorAll(".calendar-day.selected").forEach((cell) => {
                cell.classList.remove("selected");
            });

            dayCell.classList.add("selected");


            // Synchronize the selection in the annual calendar
            annualCalendar.querySelectorAll(".calendar-day.selected").forEach((cell) => {
                cell.classList.remove("selected");
            });

            const annualDayCell = annualCalendar.querySelector(
                `.calendar-day[data-date="${dayCell.dataset.date}"]`
            );

            if (annualDayCell) {
                annualDayCell.classList.add("selected");
            }

            selectedDate = new Date(`${dayCell.dataset.date}T12:00:00`);

            const isToday = selectedDate.toDateString() === today.toDateString();
                
            const assignmentHeading = document.getElementById("assignmentHeading");

            const morningAssignment = document.getElementById("morningAssignment");
            morningAssignment.textContent = isToday
                    ? "Assigned reading: Half a chapter"
                    : "No reading assignment configured for this date.";

            const eveningAssignment = document.getElementById("eveningAssignment");
            eveningAssignment.textContent = isToday
                    ? "Assigned reading: 3–4 chapters"
                    : "No reading assignment configured for this date.";

            updateReadingButtons();

            assignmentHeading.textContent = isToday
                    ? "Today's Reading Assignment"
                    : `Reading Assignment — ${selectedDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    })}`;

            console.log("Selected date:", dayCell.dataset.date);
        });


        // Highlight today's date
        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate()
        ) {
            dayCell.classList.add("today");
            dayCell.classList.add("selected");
        }

        updateCalendarDay(dayCell);
        calendarGrid.appendChild(dayCell);
    }

    // Add the completed grid to the month card
    monthCard.appendChild(calendarGrid);

    // Add the completed month card to the carousel
    calendarCarousel.appendChild(monthCard);
}

const annualCalendar = document.getElementById("annualCalendar");

for (let month = 0; month < 12; month++) {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = firstDay.toLocaleString("en-US", {
        month: "long"
    });

    // Create the month card
    const monthCard = document.createElement("div");
    monthCard.classList.add("col-6", "col-md-4", "col-lg-3");

    const monthContent = document.createElement("div");
    monthContent.classList.add("annual-month-card");

    const monthTitle = document.createElement("h3");
    monthTitle.classList.add("h6", "text-center");
    monthTitle.textContent = monthName;
    monthContent.appendChild(monthTitle);

    // Create the calendar grid
    const calendarGrid = document.createElement("div");
    calendarGrid.classList.add("calendar-grid", "annual-calendar-grid");

    // Add weekday headings
    weekdays.forEach(day => {
        const weekdayCell = document.createElement("div");
        weekdayCell.classList.add("weekday");
        weekdayCell.textContent = day[0];
        calendarGrid.appendChild(weekdayCell);
    });

    // Add empty cells before the first day
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement("div");
        calendarGrid.appendChild(emptyCell);
    }

    // Add the numbered days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("calendar-day");

        const dayNumber = document.createElement("span");
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);


        dayCell.dataset.date =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        
        dayCell.addEventListener("click", () => {
            const dateKey = dayCell.dataset.date;

            // Switch back to the monthly calendar
            annualProgressView.classList.add("d-none");
            calendarCarousel.classList.remove("d-none");
            showAnnualProgressBtn.parentElement.classList.remove("d-none");

            // Find the corresponding date in the monthly calendar
            const monthlyDayCell = calendarCarousel.querySelector(
                `.calendar-day[data-date="${dateKey}"]`
            );

            if (monthlyDayCell) {
                monthlyDayCell.click();

                // Synchronize the purple selection frame in both calendars
                // Synchronize the selection in the annual calendar
                annualCalendar.querySelectorAll(".calendar-day.selected").forEach((cell) => {
                    cell.classList.remove("selected");
                });

                dayCell.classList.add("selected");

                // Bring the correct month into view
                const monthCard = monthlyDayCell.closest(".calendar-month");

                if (monthCard) {
                    calendarCarousel.scrollLeft =
                        monthCard.offsetLeft - calendarCarousel.offsetLeft;
                }
            }
        });

        // Highlight and select today's date
        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate()
        ) {
            dayCell.classList.add("today", "selected");
        }

        updateCalendarDay(dayCell);

        calendarGrid.appendChild(dayCell);
    }

    monthContent.appendChild(calendarGrid);
    monthCard.appendChild(monthContent);
    annualCalendar.appendChild(monthCard);
}

// Scroll to the current month
const currentMonthCard = document.getElementById(`month-${today.getMonth()}`);

if (currentMonthCard && calendarCarousel) {
    calendarCarousel.scrollLeft =
        currentMonthCard.offsetLeft - calendarCarousel.offsetLeft;
}

const readingButtons = document.querySelectorAll(".mark-read-btn");

readingButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const dateKey = getLocalDateKey(selectedDate);
        const dateProgress = getReadingProgress(dateKey);

        const isMorning = button.textContent.toLowerCase().includes("morning");
        const readingType = isMorning ? "morning" : "evening";

        const isCompleted = dateProgress[readingType];

        dateProgress[readingType] = !isCompleted;

        localStorage.setItem(
            "readingProgress",
            JSON.stringify(readingProgress)
        );

        const dayCells = document.querySelectorAll(
            `.calendar-day[data-date="${dateKey}"]`
        );

        dayCells.forEach((dayCell) => {
            updateCalendarDay(dayCell);
        });

        button.dataset.completed = String(dateProgress[readingType]);

        if (!isCompleted) {
            button.classList.add("reading-completed");
            button.textContent = isMorning
                ? "Morning reading completed ✓ — Undo"
                : "Evening reading completed ✓ — Undo";
        } else {
            button.classList.remove("reading-completed");
            button.textContent = isMorning
                ? "Mark morning as read"
                : "Mark evening as read";
        }
    });
});


updateReadingButtons();

const resetProgressBtn = document.getElementById("resetProgressBtn");

resetProgressBtn.addEventListener("click", () => {
    const confirmReset = confirm(
        "Are you sure you want to reset all reading progress? This cannot be undone."
    );

    if (confirmReset) {
        localStorage.removeItem("readingProgress");
        location.reload();
    }
});

const copyrightYear = document.getElementById("copyrightYear");

if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
}

const showAnnualProgressBtn = document.getElementById("showAnnualProgress");
const backToMonthlyViewBtn = document.getElementById("backToMonthlyView");
const annualProgressView = document.getElementById("annualProgressView");

// Show the annual progress view
showAnnualProgressBtn.addEventListener("click", function () {
    showAnnualProgressBtn.parentElement.classList.add("d-none");
    calendarCarousel.classList.add("d-none");
    annualProgressView.classList.remove("d-none");
});

// Return to the monthly calendar
backToMonthlyViewBtn.addEventListener("click", function () {
    annualProgressView.classList.add("d-none");
    calendarCarousel.classList.remove("d-none");
    showAnnualProgressBtn.parentElement.classList.remove("d-none");
});