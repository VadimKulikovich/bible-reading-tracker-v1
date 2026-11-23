const curriculumContainer = document.getElementById("curriculumContainer");

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const currentYear = new Date().getFullYear();

monthNames.forEach((monthName, monthIndex) => {
    const daysInMonth = new Date(
        currentYear,
        monthIndex + 1,
        0
    ).getDate();

    const monthColumn = document.createElement("div");
    monthColumn.classList.add("col-12", "col-md-6", "col-lg-4");

    const monthSection = document.createElement("section");
    monthSection.classList.add("curriculum-month");

    const monthHeading = document.createElement("h2");
    monthHeading.textContent = monthName;
    monthSection.appendChild(monthHeading);

    const table = document.createElement("table");
    table.classList.add("table", "table-sm", "curriculum-table");

    table.innerHTML = `
        <thead>
            <tr>
                <th>Day</th>
                <th>Morning</th>
                <th>Evening</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tableBody = table.querySelector("tbody");

    for (let day = 1; day <= daysInMonth; day++) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${day}</td>
            <td>Reading</td>
            <td>Reading</td>
        `;

        tableBody.appendChild(row);
    }

    monthSection.appendChild(table);
    monthColumn.appendChild(monthSection);
    curriculumContainer.appendChild(monthColumn);
});