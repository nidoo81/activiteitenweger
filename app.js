const SUPABASE_URL = "https://xciwddigzqpchnewrhsr.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_IbRastHBW1Atx0WBPCpGqA_8CatBnuQ"function showPagefunction showPage;

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

/* =====================================
   ACTIVITEITENWEGER
===================================== */


/* =====================================
   ACTIVITEITEN
===================================== */

let activityDefinitions = [

    {
        id: 1,
        name: "Wandelen",
        icon: "🚶",
        pointsPer30: 2
    },

    {
        id: 2,
        name: "Fietsen",
        icon: "🚲",
        pointsPer30: 2
    },

    {
        id: 3,
        name: "Huishouden",
        icon: "🏠",
        pointsPer30: 3
    },

    {
        id: 4,
        name: "Hardlopen",
        icon: "🏃",
        pointsPer30: 3
    }

];


/* =====================================
   DAGGEGEVENS
===================================== */

let dailyData = {};

let activeDateKey = null;


/* =====================================
   STREEFDOELEN
===================================== */

let goals = {

    workday: 65,

    freeDay: 30,

    weekend: 45

};


/* =====================================
   DATUM
===================================== */

function getDateKey() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function getDateKeyFromDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =====================================
   DAGTYPE
===================================== */

function getDefaultDayType(date) {

    const day = date.getDay();

    if (day === 0 || day === 6) {
        return "weekend";
    }

    return "workday";
}


function getTodayData() {

    const dateKey =
        getDateKey();

    if (!dailyData[dateKey]) {

        dailyData[dateKey] = {

            type:
                getDefaultDayType(
                    new Date()
                ),

            activities: []

        };

    }

    return dailyData[dateKey];

}


function getActiveDateKey() {

    if (activeDateKey) {

        return activeDateKey;

    }

    return getDateKey();

}


function getActiveDayData() {

    const dateKey =
        getActiveDateKey();

    if (!dailyData[dateKey]) {

        const date =
            new Date(
                dateKey + "T12:00:00"
            );

        dailyData[dateKey] = {

            type:
                getDefaultDayType(date),

            activities: []

        };

    }

    return dailyData[dateKey];

}


/* =====================================
   DOEL
===================================== */

function getGoalForType(type) {

    if (type === "freeDay") {

        return goals.freeDay;

    }

    if (type === "weekend") {

        return goals.weekend;

    }

    return goals.workday;

}


function getCurrentGoal() {

    return getGoalForType(
        getTodayData().type
    );

}


/* =====================================
   SCORE
===================================== */

function calculateScore(
    activity,
    duration
) {

    return Math.round(
        (
            duration / 30
        ) *
        activity.pointsPer30
        * 10
    ) / 10;

}


function getTotalScore() {

    return getTodayData()
        .activities
        .reduce(
            (total, activity) =>
                total + Number(activity.score),
            0
        );

}


/* =====================================
   OPSLAAN
===================================== */

function saveData() {

    localStorage.setItem(
        "activityDefinitions",
        JSON.stringify(
            activityDefinitions
        )
    );

    localStorage.setItem(
        "dailyData",
        JSON.stringify(
            dailyData
        )
    );

    localStorage.setItem(
        "goals",
        JSON.stringify(
            goals
        )
    );

}


/* =====================================
   LADEN
===================================== */

function loadData() {

    const savedDefinitions =
        localStorage.getItem(
            "activityDefinitions"
        );

    const savedDailyData =
        localStorage.getItem(
            "dailyData"
        );

    const savedGoals =
        localStorage.getItem(
            "goals"
        );


    if (savedDefinitions) {

        try {

            activityDefinitions =
                JSON.parse(
                    savedDefinitions
                );

        } catch (error) {

            console.error(
                "Fout bij laden activiteiten:",
                error
            );

        }

    }


    if (savedDailyData) {

        try {

            dailyData =
                JSON.parse(
                    savedDailyData
                );

        } catch (error) {

            console.error(
                "Fout bij laden daggegevens:",
                error
            );

        }

    }


    if (savedGoals) {

        try {

            goals =
                JSON.parse(
                    savedGoals
                );

        } catch (error) {

            console.error(
                "Fout bij laden doelen:",
                error
            );

        }

    }

}


/* =====================================
   DATUM WEERGEVEN
===================================== */

function showDate() {

    const element =
        document.getElementById(
            "today-date"
        );

    if (!element) {

        return;

    }

    const date =
        new Date();

    element.textContent =
        date.toLocaleDateString(
            "nl-NL",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

}


/* =====================================
   DAGTYPE VANDAAG
===================================== */

function determineDayType() {

    return getTodayData().type;

}


function selectDayType(type) {

    getTodayData().type =
        type;

    saveData();

    updateDayTypeDisplay();

    updateDashboard();

    const menu =
        document.getElementById(
            "day-type-menu"
        );

    if (menu) {

        menu.classList.remove("show");

    }

}


function toggleDayTypeMenu() {

    const menu =
        document.getElementById(
            "day-type-menu"
        );

    if (menu) {

        menu.classList.toggle("show");

    }

}


function updateDayTypeDisplay() {

    const type =
        determineDayType();

    const icon =
        document.getElementById(
            "day-type-icon"
        );

    const name =
        document.getElementById(
            "day-type-name"
        );

    if (!icon || !name) {

        return;

    }


    if (type === "freeDay") {

        icon.textContent = "🏖️";

        name.textContent =
            "Vrije dag";

    }

    else if (type === "weekend") {

        icon.textContent = "📅";

        name.textContent =
            "Weekend";

    }

    else {

        icon.textContent = "🧑‍💼";

        name.textContent =
            "Werkdag";

    }

}


/* =====================================
   DASHBOARD
===================================== */

function updateDashboard() {

    const total =
        getTotalScore();

    const goal =
        getCurrentGoal();

    const remaining =
        Math.max(
            goal - total,
            0
        );

    const percentage =
        goal > 0
            ? Math.min(
                (total / goal) * 100,
                100
            )
            : 0;


    const currentScore =
        document.getElementById(
            "current-score"
        );

    const goalElement =
        document.getElementById(
            "goal"
        );

    const goalSmall =
        document.getElementById(
            "goal-small"
        );

    const remainingElement =
        document.getElementById(
            "remaining"
        );

    const remainingText =
        document.getElementById(
            "remaining-text"
        );


    if (currentScore) {

        currentScore.textContent =
            total;

    }


    if (goalElement) {

        goalElement.textContent =
            `${goal} punten`;

    }


    if (goalSmall) {

        goalSmall.textContent =
            `/ ${goal}`;

    }


    if (remainingElement) {

        remainingElement.textContent =
            remaining;

    }


    if (remainingText) {

        if (total === goal) {

            remainingText.innerHTML =
                "🎯 <strong>Streefdoel bereikt!</strong>";

        }

        else if (total > goal) {

            const exceeded =
                Math.round(
                    (total - goal) * 10
                ) / 10;

            remainingText.innerHTML =
                `🎯 Streefdoel overschreden met <strong>${exceeded}</strong> punten`;

        }

        else {

            remainingText.innerHTML =
                `Nog <strong>${remaining}</strong> punten beschikbaar`;

        }

    }


    const circle =
        document.getElementById(
            "score-circle"
        );

    if (circle) {

        circle.style.background =
            `conic-gradient(
                #4f46e5 ${percentage}%,
                #e5e7eb ${percentage}%
            )`;

    }


    renderActivities();

}


/* =====================================
   ACTIVITEITEN VAN VANDAAG
===================================== */

function renderActivities() {

    const container =
        document.getElementById(
            "activities"
        );

    if (!container) {

        return;

    }

    container.innerHTML = "";

    const activities =
        getTodayData().activities;


    if (activities.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                Nog geen activiteiten toegevoegd.
            </div>
        `;

        return;

    }


    activities.forEach(
        (activity, index) => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "activity";


            element.innerHTML = `

                <div class="activity-icon">
                    ${activity.icon}
                </div>


                <div class="activity-name">

                    <strong>
                        ${activity.name}
                    </strong>

                    <span>
                        ${activity.duration} minuten
                    </span>

                </div>


                <div class="activity-score">
                    +${activity.score}
                </div>


                <div class="activity-actions">

                    <button
                        class="edit-button"
                        onclick="editDailyActivity(${index})"
                        title="Activiteit aanpassen"
                    >
                        ✏️
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteActivity(${index})"
                        title="Activiteit verwijderen"
                    >
                        ×
                    </button>

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* =====================================
   ACTIVITEIT TOEVOEGEN MODAL
===================================== */

function openActivityModal() {

    activeDateKey =
        getDateKey();

    openActivityModalForSelectedDay();

}


function openActivityModalForSelectedDay() {

    const modal =
        document.getElementById(
            "activity-modal"
        );

    if (!modal) {

        return;

    }

    populateActivitySelect();


    const duration =
        document.getElementById(
            "duration"
        );

    if (duration) {

        duration.value = 30;

    }


    updateCalculatedScore();

    modal.classList.add("show");

}


function closeActivityModal() {

    const modal =
        document.getElementById(
            "activity-modal"
        );

    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================
   ACTIVITEITENLIJST MODAL
===================================== */

function populateActivitySelect() {

    const select =
        document.getElementById(
            "activity-select"
        );

    if (!select) {

        return;

    }

    select.innerHTML = "";


    activityDefinitions.forEach(
        activity => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                activity.id;

            option.textContent =
                `${activity.icon} ${activity.name}`;

            select.appendChild(
                option
            );

        }
    );


    updateCalculatedScore();

}


/* =====================================
   BEREKENDE SCORE IN MODAL
===================================== */

function updateCalculatedScore() {

    const select =
        document.getElementById(
            "activity-select"
        );

    const durationInput =
        document.getElementById(
            "duration"
        );

    const scoreElement =
        document.getElementById(
            "calculated-score"
        );


    if (
        !select ||
        !durationInput ||
        !scoreElement
    ) {

        return;

    }


    const id =
        Number(select.value);

    const duration =
        Number(durationInput.value);


    const activity =
        activityDefinitions.find(
            a => Number(a.id) === id
        );


    if (
        !activity ||
        duration <= 0
    ) {

        scoreElement.textContent =
            "0 punten";

        return;

    }


    const score =
        calculateScore(
            activity,
            duration
        );


    scoreElement.textContent =
        `${score} punten`;

}


/* =====================================
   ACTIVITEIT TOEVOEGEN
===================================== */

function addActivity() {

    const select =
        document.getElementById(
            "activity-select"
        );

    const durationInput =
        document.getElementById(
            "duration"
        );


    if (
        !select ||
        !durationInput
    ) {

        alert(
            "Activiteit of duurveld niet gevonden."
        );

        return;

    }


    const id =
        Number(select.value);

    const duration =
        Number(durationInput.value);


    const activity =
        activityDefinitions.find(
            a => Number(a.id) === id
        );


    if (!activity) {

        alert(
            "Kies eerst een activiteit."
        );

        return;

    }


    if (
        !duration ||
        duration <= 0
    ) {

        alert(
            "Vul een geldige duur in."
        );

        return;

    }


    const score =
        calculateScore(
            activity,
            duration
        );


    if (!activeDateKey) {

        activeDateKey =
            getDateKey();

    }


    const dayData =
        getActiveDayData();


    dayData.activities.push({

        name:
            activity.name,

        icon:
            activity.icon,

        duration:
            duration,

        score:
            score

    });


    saveData();

    closeActivityModal();


    if (
        document.getElementById(
            "day-page"
        ) &&
        document.getElementById(
            "day-page"
        ).style.display !== "none"
    ) {

        renderSelectedDay();

    }

    else {

        updateDashboard();

    }

}


/* =====================================
   ACTIVITEIT VERWIJDEREN
===================================== */

function deleteActivity(index) {

    const activities =
        getTodayData().activities;

    activities.splice(
        index,
        1
    );

    saveData();

    updateDashboard();

}

function editDailyActivity(index) {

    const activities =
        getTodayData().activities;

    const activity =
        activities[index];

    if (!activity) {
        return;
    }

    const newDuration =
        prompt(
            `Nieuwe duur voor ${activity.name} (minuten):`,
            activity.duration
        );

    if (newDuration === null) {
        return;
    }

    const duration =
        Number(newDuration);

    if (!duration || duration <= 0) {

        alert(
            "Vul een geldige duur in."
        );

        return;
    }

    const definition =
        activityDefinitions.find(
            a => a.name === activity.name
        );

    if (!definition) {

        alert(
            "De oorspronkelijke activiteit bestaat niet meer."
        );

        return;
    }

    activity.duration =
        duration;

    activity.score =
        calculateScore(
            definition,
            duration
        );

    saveData();

    updateDashboard();

}

/* =====================================
   INSTELLINGEN
===================================== */

function openSettings() {

    alert(
        "Gebruik 'Doelen' en 'Activiteiten' onderin om de app in te stellen."
    );

}


/* =====================================
   DOELEN
===================================== */

function loadGoalInputs() {

    const workday =
        document.getElementById(
            "workday-goal"
        );

    const freeDay =
        document.getElementById(
            "free-day-goal"
        );

    const weekend =
        document.getElementById(
            "weekend-goal"
        );


    if (workday) {

        workday.value =
            goals.workday;

    }

    if (freeDay) {

        freeDay.value =
            goals.freeDay;

    }

    if (weekend) {

        weekend.value =
            goals.weekend;

    }

}


function saveGoals() {

    const workday =
        Number(
            document.getElementById(
                "workday-goal"
            ).value
        );

    const freeDay =
        Number(
            document.getElementById(
                "free-day-goal"
            ).value
        );

    const weekend =
        Number(
            document.getElementById(
                "weekend-goal"
            ).value
        );


    if (
        workday <= 0 ||
        freeDay <= 0 ||
        weekend <= 0
    ) {

        alert(
            "Vul geldige streefdoelen in."
        );

        return;

    }


    goals = {

        workday:
            workday,

        freeDay:
            freeDay,

        weekend:
            weekend

    };


    saveData();

    updateDashboard();

    loadGoalInputs();


    alert(
        "Streefdoelen opgeslagen!"
    );

}


/* =====================================
   ACTIVITEITEN BEHEREN
===================================== */

function renderActivityDefinitions() {

    const container =
        document.getElementById(
            "activity-definitions"
        );

    if (!container) {

        return;

    }

    container.innerHTML = "";


    activityDefinitions.forEach(
        (activity, index) => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "activity";


            element.innerHTML = `

                <div class="activity-icon">
                    ${activity.icon}
                </div>

                <div class="activity-name">

                    <strong>
                        ${activity.name}
                    </strong>

                    <span>
                        ${activity.pointsPer30}
                        punten per 30 minuten
                    </span>

                </div>

                <div class="activity-actions">

                    <button
                        class="edit-button"
                        onclick="openEditActivityModal(${index})"
                    >
                        ✏️
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteActivityDefinition(${index})"
                    >
                        🗑️
                    </button>

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );

}


function deleteActivityDefinition(index) {

    const activity =
        activityDefinitions[index];

    if (!activity) {

        return;

    }


    const confirmDelete =
        confirm(
            `Wil je "${activity.name}" verwijderen?`
        );


    if (!confirmDelete) {

        return;

    }


    activityDefinitions.splice(
        index,
        1
    );

    saveData();

    renderActivityDefinitions();

}


/* =====================================
   ACTIVITEIT BEWERKEN
===================================== */

let editingActivityIndex =
    null;


function openNewActivityModal() {

    editingActivityIndex =
        null;


    const title =
        document.getElementById(
            "activity-modal-title"
        );

    const name =
        document.getElementById(
            "definition-name"
        );

    const icon =
        document.getElementById(
            "definition-icon"
        );

    const points =
        document.getElementById(
            "definition-points"
        );


    if (title) {

        title.textContent =
            "Nieuwe activiteit";

    }

    if (name) {

        name.value = "";

    }

    if (icon) {

        icon.value = "⭐";

    }

    if (points) {

        points.value = "";

    }


    const modal =
        document.getElementById(
            "manage-modal"
        );

    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function openEditActivityModal(index) {

    const activity =
        activityDefinitions[index];

    if (!activity) {

        return;

    }


    editingActivityIndex =
        index;


    const title =
        document.getElementById(
            "activity-modal-title"
        );

    const name =
        document.getElementById(
            "definition-name"
        );

    const icon =
        document.getElementById(
            "definition-icon"
        );

    const points =
        document.getElementById(
            "definition-points"
        );


    if (title) {

        title.textContent =
            "Activiteit aanpassen";

    }

    if (name) {

        name.value =
            activity.name;

    }

    if (icon) {

        icon.value =
            activity.icon;

    }

    if (points) {

        points.value =
            activity.pointsPer30;

    }


    const modal =
        document.getElementById(
            "manage-modal"
        );

    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function saveActivityDefinition() {

    const name =
        document
            .getElementById(
                "definition-name"
            )
            .value
            .trim();

    const icon =
        document
            .getElementById(
                "definition-icon"
            )
            .value
            .trim();

    const points =
        Number(
            document.getElementById(
                "definition-points"
            ).value
        );


    if (!name) {

        alert(
            "Vul een naam in."
        );

        return;

    }


    if (
        !points ||
        points <= 0
    ) {

        alert(
            "Vul een geldige score in."
        );

        return;

    }


    if (
        editingActivityIndex !== null
    ) {

        const activity =
            activityDefinitions[
                editingActivityIndex
            ];

        activity.name =
            name;

        activity.icon =
            icon || "⭐";

        activity.pointsPer30 =
            points;

    }

    else {

        activityDefinitions.push({

            id:
                Date.now(),

            name:
                name,

            icon:
                icon || "⭐",

            pointsPer30:
                points

        });

    }


    saveData();

    closeManageModal();

    renderActivityDefinitions();

}


function closeManageModal() {

    const modal =
        document.getElementById(
            "manage-modal"
        );

    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================
   WEEKOVERZICHT
===================================== */

let weekOffset = 0;

function getStartOfWeek() {

    const date =
        new Date();

    const day =
        date.getDay();

    const difference =
        day === 0
            ? -6
            : 1 - day;


    date.setDate(
        date.getDate() + difference
    );


    date.setDate(
        date.getDate() + (weekOffset * 7)
    );


    date.setHours(
        0,
        0,
        0,
        0
    );

    return date;

}


function changeWeek(direction) {

    weekOffset += direction;

    renderWeekOverview();

}

function goToCurrentWeek() {

    weekOffset = 0;

    renderWeekOverview();

}

function updateWeekTitle(start) {

    const title =
        document.getElementById("week-title");

    if (!title) {
        return;
    }

    if (weekOffset === 0) {

        title.textContent = "Deze week";

        return;
    }

    const end =
        new Date(start);

    end.setDate(
        end.getDate() + 6
    );

    const startText =
        start.toLocaleDateString(
            "nl-NL",
            {
                day: "numeric",
                month: "long"
            }
        );

    const endText =
        end.toLocaleDateString(
            "nl-NL",
            {
                day: "numeric",
                month: "long"
            }
        );

    title.textContent =
        `${startText} – ${endText}`;

}

/* =====================================
   MAANDOVERZICHT
===================================== */

function changeOverviewPeriod(direction) {

    if (overviewView === "week") {

        changeWeek(direction);

    }

    else {

        changeMonth(direction);

    }

}


function goToCurrentOverviewPeriod() {

    if (overviewView === "week") {

        goToCurrentWeek();

    }

    else {

        goToCurrentMonth();

    }

}

function changeMonth(direction) {

    monthOffset += direction;

    renderMonthOverview();

}


function goToCurrentMonth() {

    monthOffset = 0;

    renderMonthOverview();

    const title =
        document.getElementById("week-title");

    if (title) {

        title.textContent =
            new Date().toLocaleDateString(
                "nl-NL",
                {
                    month: "long",
                    year: "numeric"
                }
            );

    }

}

function renderMonthOverview() {

    const container =
        document.getElementById("week-list");

    if (!container) {
        return;
    }

    container.innerHTML = "";

container.className = "month-calendar";

const dayHeader =
    document.createElement("div");

dayHeader.className =
    "month-calendar-header";

dayHeader.innerHTML = `
    <div>Ma</div>
    <div>Di</div>
    <div>Wo</div>
    <div>Do</div>
    <div>Vr</div>
    <div>Za</div>
    <div>Zo</div>
`;

container.appendChild(
    dayHeader
);

    const today =
    new Date();

const selectedDate =
    new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1
    );

const month =
    selectedDate.getMonth();

const year =
    selectedDate.getFullYear();

    const monthNames = [
        "januari",
        "februari",
        "maart",
        "april",
        "mei",
        "juni",
        "juli",
        "augustus",
        "september",
        "oktober",
        "november",
        "december"
    ];

    const title =
        document.getElementById("week-title");

const todayButton =
    document.querySelector(".today-button");

if (todayButton) {

    todayButton.style.display =
        monthOffset === 0
            ? "none"
            : "block";

    todayButton.textContent =
        "Deze maand";

}

    if (title) {

        title.textContent =
            `${monthNames[month]} ${year}`;

    }

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

let totalScore = 0;
let goodDays = 0;

const firstDay =
    new Date(
        year,
        month,
        1
    );

const firstDayMondayIndex =
    (firstDay.getDay() + 6) % 7;

    for (let day = 1; day <= daysInMonth; day++) {

        const date =
            new Date(
                year,
                month,
                day,
                12
            );

        const dateKey =
            getDateKeyFromDate(date);

        const data =
            dailyData[dateKey];

        let score = 0;

        let type =
            getDefaultDayType(date);

        let hasActivities = false;


        if (data) {

            type =
                data.type ||
                getDefaultDayType(date);

            hasActivities =
                data.activities &&
                data.activities.length > 0;

            if (hasActivities) {

                score =
                    data.activities.reduce(
                        (total, activity) =>
                            total +
                            Number(activity.score || 0),
                        0
                    );

            }

        }


        const goal =
            getGoalForType(type);

if (hasActivities) {

    totalScore += score;

    if (score >= goal) {

        goodDays++;

    }

}

        let status = "⚪";

        if (hasActivities) {

            if (score >= goal) {

                status = "🔴";

            }

            else if (
                goal > 0 &&
                score / goal >= 0.7
            ) {

                status = "🟠";

            }

            else {

                status = "🟢";

            }

        }


       const dayNames = [
    "Ma",
    "Di",
    "Wo",
    "Do",
    "Vr",
    "Za",
    "Zo"
];


        const element =
            document.createElement("div");

        element.className =
    "month-day";

if (day === 1) {

    element.style.gridColumnStart =
        firstDayMondayIndex + 1;

}

const todayKey =
    getDateKey();

if (dateKey === todayKey) {

    element.classList.add(
        "today"
    );

}

        element.style.cursor =
            "pointer";

        element.onclick =
            function() {

                openDay(dateKey);

            };


        element.innerHTML = `

            <div class="month-day-date">

                <strong>
                    ${dayNames[(date.getDay() + 6) % 7]}
                </strong>

                <span class="month-day-number">
    ${day}
    ${monthNames[month].substring(0, 3)}
</span>

            </div>


            <div class="month-day-score">

                <strong>
                    ${score}
                </strong>

                <span>
                    / ${goal}
                </span>

            </div>


            <div class="month-day-status">

                ${status}

            </div>

        `;


       container.appendChild(
    element
);

}


const average =
    Math.round(
        totalScore / daysInMonth
    );


const averageElement =
    document.getElementById(
        "week-average"
    );

const goodDaysElement =
    document.getElementById(
        "week-good-days"
    );


if (averageElement) {

    averageElement.textContent =
        average;

}


if (goodDaysElement) {

    goodDaysElement.textContent =
        `${goodDays} van ${daysInMonth}`;

}

}

function renderWeekOverview() {

    const container =
        document.getElementById("week-list");

    container.innerHTML = "";

container.className =
    "week-list";

    const start =
    getStartOfWeek();

const todayButton =
    document.querySelector(".today-button");

if (todayButton) {

    todayButton.style.display =
        weekOffset === 0
            ? "none"
            : "block";

}

updateWeekTitle(start);

    let totalScore = 0;
    let goodDays = 0;

    for (let i = 0; i < 7; i++) {

        const date =
            new Date(start);

        date.setDate(
            start.getDate() + i
        );

        const dateKey =
            getDateKeyFromDate(date);

        const data =
            dailyData[dateKey];

        let score = 0;
        let type = getDefaultDayType(date);
        let hasActivities = false;

        if (data) {

    type =
        data.type ||
        getDefaultDayType(date);

    hasActivities =
        data.activities &&
        data.activities.length > 0;

            if (hasActivities) {

                score =
                    data.activities.reduce(
                        (total, activity) =>
                            total + Number(activity.score || 0),
                        0
                    );

            }

        }

        const goal =
            getGoalForType(type);

        const percentage =
            goal > 0
                ? (score / goal) * 100
                : 0;

        /*
           Alleen dagen waarop iets is ingevuld
           tellen mee als "binnen doel".
        */

        if (
            hasActivities &&
            score >= goal
        ) {

            goodDays++;

        }

        totalScore += score;

        const dayNames = [
            "Zo",
            "Ma",
            "Di",
            "Wo",
            "Do",
            "Vr",
            "Za"
        ];

        const dayName =
            dayNames[date.getDay()];

        const formattedDate =
            date.toLocaleDateString(
                "nl-NL",
                {
                    day: "numeric",
                    month: "short"
                }
            );

        let typeIcon = "🧑‍💼";
        let typeName = "Werkdag";

        if (type === "freeDay") {

            typeIcon = "🏖️";
            typeName = "Vrije dag";

        }

        else if (type === "weekend") {

            typeIcon = "📅";
            typeName = "Weekend";

        }

        let status = "⚪";
let statusText = "Nog niets ingevuld";

if (hasActivities) {

    if (score >= goal) {

        status = "🎯";
        statusText = "Streefdoel bereikt";

    }

    else if (percentage >= 70) {

        status = "🟠";
        statusText = "Bijna op doel";

    }

    else {

        status = "🟢";
        statusText = "Nog bezig";

    }

}

        const element =
            document.createElement("div");

        element.className =
            "week-day";

        element.style.cursor =
            "pointer";

        element.onclick =
            function() {

                openDay(dateKey);

            };

        element.innerHTML = `

            <div class="week-day-date">

                <strong>
                    ${dayName}
                </strong>

                <span>
                    ${formattedDate}
                </span>

                <small>
                    ${typeIcon} ${typeName}
                </small>

            </div>

            <div class="week-day-score">

                <strong>
                    ${score}
                </strong>

                <span>
                    / ${goal}
                </span>

            </div>

            <div class="week-day-status">

    <strong>${status}</strong>

    <small>
        ${statusText}
    </small>

</div>

        `;

        container.appendChild(element);

    }

    const average =
        Math.round(
            totalScore / 7
        );

    document.getElementById(
        "week-average"
    ).textContent =
        average;

    document.getElementById(
        "week-good-days"
    ).textContent =
        goodDays;

}


/* =====================================
   GESELECTEERDE DAG
===================================== */

function openDay(dateKey) {

    activeDateKey =
        dateKey;

    showPage("day");

    renderSelectedDay();

}


function renderSelectedDay() {

    const dateKey =
        getActiveDateKey();

    const data =
        getActiveDayData();


    const date =
        new Date(
            dateKey + "T12:00:00"
        );


    const title =
        date.toLocaleDateString(
            "nl-NL",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const titleElement =
        document.getElementById(
            "selected-day-title"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    const score =
        data.activities.reduce(
            (total, activity) =>
                total +
                Number(activity.score),
            0
        );


    const goal =
        getGoalForType(
            data.type
        );


    const scoreElement =
        document.getElementById(
            "selected-day-score"
        );

    const goalElement =
        document.getElementById(
            "selected-day-goal"
        );


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }

    if (goalElement) {

        goalElement.textContent =
            goal;

    }


    updateSelectedDayTypeDisplay();

    renderSelectedDayActivities();

}


function renderSelectedDayActivities() {

    const container =
        document.getElementById(
            "selected-day-activities"
        );

    if (!container) {

        return;

    }

    container.innerHTML = "";


    const activities =
        getActiveDayData()
            .activities;


    if (
        activities.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">
                Nog geen activiteiten.
            </div>
        `;

        return;

    }


    activities.forEach(
        (activity, index) => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "activity";


            element.innerHTML = `

                <div class="activity-icon">
                    ${activity.icon}
                </div>

                <div class="activity-name">

                    <strong>
                        ${activity.name}
                    </strong>

                    <span>
                        ${activity.duration}
                        minuten
                    </span>

                </div>

                <div class="activity-score">
                    +${activity.score}
                </div>

                <button
                    class="delete-button"
                    onclick="deleteSelectedDayActivity(${index})"
                >
                    ×
                </button>

            `;


            container.appendChild(
                element
            );

        }
    );

}


function deleteSelectedDayActivity(index) {

    getActiveDayData()
        .activities
        .splice(
            index,
            1
        );


    saveData();

    renderSelectedDay();

}


/* =====================================
   DAGTYPE GESELECTEERDE DAG
===================================== */

function toggleSelectedDayTypeMenu() {

    const menu =
        document.getElementById(
            "selected-day-type-menu"
        );

    if (menu) {

        menu.classList.toggle(
            "show"
        );

    }

}


function selectSelectedDayType(type) {

    getActiveDayData().type =
        type;

    saveData();

    renderSelectedDay();

    const menu =
        document.getElementById(
            "selected-day-type-menu"
        );

    if (menu) {

        menu.classList.remove(
            "show"
        );

    }

}


function updateSelectedDayTypeDisplay() {

    const data =
        getActiveDayData();

    const type =
        data.type;


    const icon =
        document.getElementById(
            "selected-day-type-icon"
        );

    const name =
        document.getElementById(
            "selected-day-type-name"
        );


    if (!icon || !name) {

        return;

    }


    if (type === "freeDay") {

        icon.textContent = "🏖️";

        name.textContent =
            "Vrije dag";

    }

    else if (type === "weekend") {

        icon.textContent = "📅";

        name.textContent =
            "Weekend";

    }

    else {

        icon.textContent = "🧑‍💼";

        name.textContent =
            "Werkdag";

    }

}


/* =====================================
   PAGINA NAVIGATIE
===================================== */

async function loginUser() {

    const email =
        document.getElementById("login-email").value.trim();

    const password =
        document.getElementById("login-password").value;

    const message =
        document.getElementById("login-message");

    if (!email || !password) {
        message.textContent =
            "Vul je e-mailadres en wachtwoord in.";
        return;
    }

    message.textContent = "Inloggen...";

    const { error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        message.textContent =
            "Inloggen mislukt: " + error.message;
        return;
    }

    document.getElementById(
        "login-screen"
    ).style.display = "none";

    document.querySelector(
        ".app"
    ).style.display = "block";
}

window.loginUser = loginUser;

function showPage(page) {

    const header =
        document.querySelector(
            ".header"
        );

    const scoreCard =
        document.querySelector(
            ".score-card"
        );

    const activitiesSection =
        document.querySelector(
            ".activities-section"
        );

    const goalsPage =
        document.getElementById(
            "goals-page"
        );

    const activitiesPage =
        document.getElementById(
            "activities-page"
        );

    const overviewPage =
        document.getElementById(
            "overview-page"
        );

    const dayPage =
        document.getElementById(
            "day-page"
        );


    if (header) {

        header.style.display =
            "none";

    }

    if (scoreCard) {

        scoreCard.style.display =
            "none";

    }

    if (activitiesSection) {

        activitiesSection.style.display =
            "none";

    }

    if (goalsPage) {

        goalsPage.style.display =
            "none";

    }

    if (activitiesPage) {

        activitiesPage.style.display =
            "none";

    }

    if (overviewPage) {

        overviewPage.style.display =
            "none";

    }

    if (dayPage) {

        dayPage.style.display =
            "none";

    }


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.classList.remove(
                "active"
            );

        }
    );


    if (page === "today") {

        if (header) {

            header.style.display =
                "flex";

        }

        if (scoreCard) {

            scoreCard.style.display =
                "flex";

        }

        if (activitiesSection) {

            activitiesSection.style.display =
                "block";

        }

        if (navItems[0]) {

            navItems[0].classList.add(
                "active"
            );

        }

    }


    if (page === "overview") {

        if (overviewPage) {

            overviewPage.style.display =
                "block";

        }

weekOffset = 0;

        renderWeekOverview();

        if (navItems[1]) {

            navItems[1].classList.add(
                "active"
            );

        }

    }


    if (page === "goals") {

        if (goalsPage) {

            goalsPage.style.display =
                "block";

        }

        loadGoalInputs();

        if (navItems[2]) {

            navItems[2].classList.add(
                "active"
            );

        }

    }


    if (page === "activities") {

        if (activitiesPage) {

            activitiesPage.style.display =
                "block";

        }

        renderActivityDefinitions();

        if (navItems[3]) {

            navItems[3].classList.add(
                "active"
            );

        }

    }


    if (page === "day") {

        if (dayPage) {

            dayPage.style.display =
                "block";

        }

    }

}

/* =====================================
   WEEK / MAAND WEERGAVE
===================================== */

let overviewView = "week";

let monthOffset = 0;


function setOverviewView(view) {

    overviewView = view;

    const weekButton =
        document.getElementById(
            "week-view-button"
        );

    const monthButton =
        document.getElementById(
            "month-view-button"
        );


    if (weekButton) {

        weekButton.classList.toggle(
            "active",
            view === "week"
        );

    }


    if (monthButton) {

        monthButton.classList.toggle(
            "active",
            view === "month"
        );

    }

const monthNavigation =
    document.getElementById(
        "month-navigation"
    );

if (monthNavigation) {

    monthNavigation.style.display =
        view === "month"
            ? "flex"
            : "none";

}

    if (view === "week") {

        renderWeekOverview();

    }

    else {

        renderMonthOverview();

    }

}


/* =====================================
   EVENTS
===================================== */

function setupEvents() {

    const select =
        document.getElementById(
            "activity-select"
        );

    const duration =
        document.getElementById(
            "duration"
        );


    if (select) {

        select.addEventListener(
            "change",
            updateCalculatedScore
        );

    }


    if (duration) {

        duration.addEventListener(
            "input",
            updateCalculatedScore
        );

    }

}


/* =====================================
   START APP
===================================== */

function startApp() {

    loadData();

    showDate();

    getTodayData();

    loadGoalInputs();

    updateDayTypeDisplay();

    setupEvents();

    updateDashboard();

}


/* =====================================
   START
===================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startApp
    );

}

else {

    startApp();

}