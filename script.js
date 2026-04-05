let students = [];
let subjects = [];

let studentChart, subjectChart, gradeChart;

/* ================= SUBJECT INPUT ================= */

// Generate subject input fields
function generateSubjects() {
    let num = document.getElementById("numSubjects").value;
    let div = document.getElementById("subjectNames");
    div.innerHTML = "";

    for (let i = 0; i < num; i++) {
        div.innerHTML += `
            Subject ${i + 1}: 
            <input type="text" id="sub${i}"><br>
        `;
    }

    div.innerHTML += `<br><button onclick="saveSubjects()">Save Subjects</button>`;
}

// Save subject names
function saveSubjects() {
    subjects = [];
    let num = document.getElementById("numSubjects").value;

    for (let i = 0; i < num; i++) {
        let sub = document.getElementById(`sub${i}`).value.trim();
        if (sub === "") {
            alert("Please enter all subject names ❗");
            return;
        }
        subjects.push(sub);
    }

    alert("Subjects Saved Successfully ✅");
}

/* ================= STUDENT FORM ================= */

function generateForm() {
    if (subjects.length === 0) {
        alert("⚠️ Please add subjects first!");
        return;
    }

    let num = document.getElementById("numStudents").value;
    let form = document.getElementById("studentForm");
    form.innerHTML = "";

    for (let i = 0; i < num; i++) {
        let div = document.createElement("div");

        div.innerHTML = `
            <h4>Student ${i + 1}</h4>
            Roll No: <input type="text" id="roll${i}"><br>
            Name: <input type="text" id="name${i}"><br>
            ${subjects.map(sub => `${sub}: <input type="number" id="${sub}${i}"><br>`).join("")}
            <hr>
        `;

        form.appendChild(div);
    }

    let btn = document.createElement("button");
    btn.innerText = "Calculate Result";
    btn.onclick = calculateResult;
    form.appendChild(btn);
}

/* ================= RESULT CALCULATION ================= */

function calculateResult() {
    students = [];
    let num = document.getElementById("numStudents").value;

    for (let i = 0; i < num; i++) {
        let roll = document.getElementById(`roll${i}`).value;
        let name = document.getElementById(`name${i}`).value;

        let marks = subjects.map(sub => {
            let value = Number(document.getElementById(`${sub}${i}`).value);
            return isNaN(value) ? 0 : value;
        });

        let total = marks.reduce((a, b) => a + b, 0);
        let percentage = total / subjects.length;

        let grade = getGrade(percentage);
        let cgpa = (percentage / 10).toFixed(2);

        students.push({ roll, name, marks, percentage, grade, cgpa });
    }

    displayResults();
    analyzePerformance();
    generateCharts();
}

/* ================= GRADE ================= */

function getGrade(p) {
    if (p >= 90) return "A+";
    if (p >= 80) return "A";
    if (p >= 70) return "B";
    if (p >= 60) return "C";
    if (p >= 50) return "D";
    return "F";
}

/* ================= DISPLAY ================= */

function displayResults() {
    let table = document.getElementById("resultTable");
    table.innerHTML = "";

    students.forEach(s => {
        let row = `<tr>
            <td>${s.roll}</td>
            <td>${s.name}</td>
            <td>${s.percentage.toFixed(2)}</td>
            <td>${s.grade}</td>
            <td>${s.cgpa}</td>
        </tr>`;
        table.innerHTML += row;
    });

    document.getElementById("courseInfo").innerText =
        "Course: " + document.getElementById("course").value;

    document.getElementById("semesterInfo").innerText =
        "Semester: " + document.getElementById("semester").value;
}

/* ================= ANALYSIS ================= */

function analyzePerformance() {
    if (students.length === 0) return;

    let sorted = [...students].sort((a, b) => b.percentage - a.percentage);

    document.getElementById("topper").innerText =
        `${sorted[0].name} (${sorted[0].percentage.toFixed(2)}%)`;

    document.getElementById("lowest").innerText =
        `${sorted[sorted.length - 1].name} (${sorted[sorted.length - 1].percentage.toFixed(2)}%)`;

    // Subject Difficulty
    let difficultyList = document.getElementById("difficulty");
    difficultyList.innerHTML = "";

    subjects.forEach((sub, index) => {
        let avg =
            students.reduce((sum, s) => sum + s.marks[index], 0) /
            students.length;

        let li = document.createElement("li");
        li.innerText = `${sub} Avg: ${avg.toFixed(2)}`;
        difficultyList.appendChild(li);
    });
}

/* ================= SEARCH ================= */

function searchStudent() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.querySelectorAll("#resultTable tr");

    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
    });
}

/* ================= RESET ================= */

function resetData() {
    location.reload();
}

/* ================= CHARTS ================= */

function generateCharts() {
    let names = students.map(s => s.name);
    let percentages = students.map(s => s.percentage);

    if (studentChart) studentChart.destroy();
    if (subjectChart) subjectChart.destroy();
    if (gradeChart) gradeChart.destroy();

    // Student Chart
    studentChart = new Chart(document.getElementById("studentChart"), {
        type: "bar",
        data: {
            labels: names,
            datasets: [{
                label: "Percentage",
                data: percentages
            }]
        }
    });

    // Subject Chart
    let avgMarks = subjects.map((sub, i) =>
        students.reduce((sum, s) => sum + s.marks[i], 0) / students.length
    );

    subjectChart = new Chart(document.getElementById("subjectChart"), {
        type: "bar",
        data: {
            labels: subjects,
            datasets: [{
                label: "Average Marks",
                data: avgMarks
            }]
        }
    });

    // Grade Chart
    let gradeCount = {};
    students.forEach(s => {
        gradeCount[s.grade] = (gradeCount[s.grade] || 0) + 1;
    });

    gradeChart = new Chart(document.getElementById("gradeChart"), {
        type: "pie",
        data: {
            labels: Object.keys(gradeCount),
            datasets: [{
                data: Object.values(gradeCount)
            }]
        }
    });
}

/* ================= DARK MODE ================= */

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}