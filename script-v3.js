// =========================
// Activiteitenweger Basalt
// =========================

let activiteiten =
JSON.parse(
    localStorage.getItem("activiteiten")
    || "[]"
);

activiteiten.forEach(a=>{

    if(!a.id){

        a.id = Date.now() + Math.random();

    }

    if(a.gebruikt === undefined){

        a.gebruikt = 0;

    }

    if(a.favoriet === undefined){

        a.favoriet = false;

    }

});

localStorage.setItem(

    "activiteiten",

    JSON.stringify(activiteiten)

);

// =========================
// Activiteit toevoegen
// =========================

let bewerkIndex = -1;

let huidigeDatum = new Date();

let planningGewijzigd = false;

function toevoegen(){

    let naam =
        document.getElementById("naam").value.trim();

    let categorie =
        document.getElementById("categorie").value;

    let waarde =
        Number(document.getElementById("waarde").value);

    if(naam === ""){

        alert("Vul een naam in.");

        return;

    }

    if(bewerkIndex >= 0){

        activiteiten[bewerkIndex] = {

    id: activiteiten[bewerkIndex].id,

    naam: naam,
    categorie: categorie,
    waarde: waarde,
    favoriet: activiteiten[bewerkIndex].favoriet || false

};

        bewerkIndex = -1;

    }else{

        activiteiten.push({

    id: Date.now(),

    naam: naam,
    categorie: categorie,
    waarde: waarde,

    favoriet: false,

    gebruikt: 0

});

    }

    localStorage.setItem(
        "activiteiten",
        JSON.stringify(activiteiten)
    );

    document.getElementById("naam").value = "";
    document.getElementById("waarde").value = "";

    tekenLijst();

}

// =========================
// Lijst tonen
// =========================

function tekenLijst(){

    let html = "";

    let lijst = [...activiteiten];

    let zoek =
        document.getElementById("zoeken")
        .value
        .toLowerCase();

    if(zoek !== ""){

        lijst = lijst.filter(a=>

            a.naam.toLowerCase().includes(zoek)

            ||

            a.categorie.toLowerCase().includes(zoek)

        );

    }

if(document.getElementById("alleenFavorieten").checked){

    lijst = lijst.filter(a=>a.favoriet);

}

    let sortering =
        document.getElementById("sorteren")
        .value;

    lijst.sort((a,b)=>{

        // Favorieten altijd bovenaan
        if(a.favoriet !== b.favoriet){

            return a.favoriet ? -1 : 1;

        }

        // Daarna gekozen sortering
        switch(sortering){

            case "az":
                return a.naam.localeCompare(b.naam);

            case "za":
                return b.naam.localeCompare(a.naam);

            case "laaghoog":
                return a.waarde - b.waarde;

            case "hooglaag":
                return b.waarde - a.waarde;

            default:
                return 0;

        }

    });

    lijst.forEach(a=>{

        html += `

        <div class="activiteit">

            <div>

                <b>${a.naam}</b>

                - ${a.categorie}

                (${a.waarde})

            </div>

            <div class="knoppen">

                <button onclick="favoriet(${a.id})">

                    ${a.favoriet ? "⭐" : "☆"}

                </button>

                <button onclick="bewerken(${a.id})">

                    Bewerken

                </button>

                <button onclick="verwijderen(${a.id})">

                    Verwijderen

                </button>

            </div>

        </div>

        `;

    });

    if(html === ""){

        html = "Nog geen activiteiten.";

    }

    document.getElementById("lijst").innerHTML = html;

}

// =========================
// Verwijderen
// =========================

function verwijderen(id){

    let index = activiteiten.findIndex(

        a => a.id === id

    );

    if(index === -1){

        return;

    }

    activiteiten.splice(index,1);

    localStorage.setItem(

        "activiteiten",

        JSON.stringify(activiteiten)

    );

    tekenLijst();

}

function bewerken(id){

    let index = activiteiten.findIndex(

        a => a.id === id

    );

    if(index === -1){

        return;

    }

    bewerkIndex = index;

    let activiteit = activiteiten[index];

    document.getElementById("naam").value =
        activiteit.naam;

    document.getElementById("categorie").value =
        activiteit.categorie;

    document.getElementById("waarde").value =
        activiteit.waarde;

}

function favoriet(id){

    let index = activiteiten.findIndex(

        a => a.id === id

    );

    if(index === -1){

        return;

    }

    activiteiten[index].favoriet =
        !activiteiten[index].favoriet;

    localStorage.setItem(

        "activiteiten",

        JSON.stringify(activiteiten)

    );

    tekenLijst();

}

function opslaanBewerking(){

    activiteiten[bewerkIndex] = {

        naam:
        document.getElementById("naam").value,

        categorie:
        document.getElementById("categorie").value,

        waarde:
        Number(
            document.getElementById("waarde").value
        )

    };

    localStorage.setItem(

        "activiteiten",

        JSON.stringify(activiteiten)

    );

    bewerkIndex = -1;

    document.getElementById("naam").value = "";
    document.getElementById("waarde").value = "";

    tekenLijst();

}

let planning = {};

let geschiedenis =
JSON.parse(
    localStorage.getItem("geschiedenis")
    || "[]"
);

let doelen = JSON.parse(

    localStorage.getItem("doelen")

) || {

    werkdag:5,

    weekend:3,

    vrijedag:2,

    ziek:0

};

function vulTijden(){

    let start = document.getElementById("startUur");
    let eind = document.getElementById("eindUur");

    start.innerHTML = "";
    eind.innerHTML = "";

    for(let uur = 0; uur <= 23; uur++){

        let tijd = String(uur).padStart(2,"0") + ":00";

        start.innerHTML += `<option value="${uur}">${tijd}</option>`;

        eind.innerHTML += `<option value="${uur}">${tijd}</option>`;

    }

    start.value = localStorage.getItem("plannerStart") || 7;
    eind.value = localStorage.getItem("plannerEind") || 22;

}

function tekenPlanner(){

    let html = "<table>";

    html += `
    <tr>
        <th>Tijd</th>
        <th>Activiteit</th>
        <th>Notitie</th>
        <th>Waarde</th>
    </tr>
    `;

    let begin = Number(document.getElementById("startUur").value);
let einde = Number(document.getElementById("eindUur").value);

localStorage.setItem("plannerStart", begin);
localStorage.setItem("plannerEind", einde);

for(let uur = begin; uur <= einde; uur++){

        for(let minuut = 0; minuut < 60; minuut += 30){

            let tijd =
                String(uur).padStart(2,"0")
                + ":"
                +
                String(minuut).padStart(2,"0");

            html += `
            <tr>

                <td>${tijd}</td>

                <td>

<select onchange="berekenPlanner(); bewaarPlanning();">

                        <option value="">-- kies activiteit --</option>
            `;

            activiteiten.forEach(a=>{

                html += `
                <option
    value="${a.id}"
    data-waarde="${a.waarde}">

    ${a.naam}

</option>
                `;

            });

            html += `

</select>

                </td>

                <td>

                    <input
type="text"
placeholder="Notitie"
onchange="bewaarPlanning()">

                </td>

                <td>0</td>

            </tr>
            `;

        }

    }

    html += "</table>";

    document.getElementById("planner").innerHTML = html;

}

function berekenPlanner(){

    let totaal = 0;

    document
    .querySelectorAll("#planner table tr")
    .forEach((rij,index)=>{

        if(index === 0){
            return;
        }

        let select = rij.querySelector("select");

        let optie =
            select.options[select.selectedIndex];

        let waarde =
            Number(optie.dataset.waarde || 0);

        rij.cells[3].innerText = waarde;

        totaal += waarde;

    });

    document.getElementById("score").innerText = totaal;

    let doel = Number(
        document.getElementById("doelVandaag").innerText
    );

    if(totaal < doel){

        document.getElementById("resultaat").innerHTML =
            '<span style="color:orange;font-weight:bold;">🟠 Onder streefdoel</span>';

    }
    else if(totaal === doel){

        document.getElementById("resultaat").innerHTML =
            '<span style="color:green;font-weight:bold;">🟢 Streefdoel bereikt</span>';

    }
    else{

        document.getElementById("resultaat").innerHTML =
            '<span style="color:red;font-weight:bold;">🔴 Boven streefdoel</span>';

    }

}

function toonDatum(){

    document.getElementById("plannerDatum").innerText =
        huidigeDatum.toLocaleDateString("nl-NL");

}

function datumSleutel(){

    return huidigeDatum.toISOString().split("T")[0];

}

function bewaarPlanning(){

planningGewijzigd = true;

    planning = {};

    document
    .querySelectorAll("#planner table tr")
    .forEach((rij,index)=>{

        if(index===0){
            return;
        }

        let tijd =
            rij.cells[0].innerText;

        let select =
            rij.querySelector("select");

        let input =
            rij.querySelector("input");

        planning[tijd] = {

           activiteit:
    select.value,

            notitie:
                input.value

        };

    });

    localStorage.setItem(

        "planning_" + datumSleutel(),

        JSON.stringify(planning)

    );

}

function laadPlanning(){

    planning = JSON.parse(

        localStorage.getItem(

            "planning_" + datumSleutel()

        ) || "{}"

    );

let dagtype = localStorage.getItem(
    "dagtype_" + datumSleutel()
);

if(dagtype){
    document.getElementById("dagtype").value = dagtype;
}

    tekenPlanner();

    document
    .querySelectorAll("#planner table tr")
    .forEach((rij,index)=>{

        if(index === 0){
            return;
        }

        let tijd = rij.cells[0].innerText;

        let select = rij.querySelector("select");
        let input = rij.querySelector("input");

        select.value = "";
        input.value = "";

        if(planning[tijd]){

            select.value =
                planning[tijd].activiteit || "";

            input.value =
                planning[tijd].notitie || "";

        }

    });

bepaalDoel();

    berekenPlanner();

}

function bepaalDoel(){

    let dagtype = document.getElementById("dagtype").value;

    localStorage.setItem(
        "dagtype_" + datumSleutel(),
        dagtype
    );

    document.getElementById("doelVandaag").innerText =
        doelen[dagtype];

}

function laadDoelen(){

    document.getElementById("doelWerkdag").value =
        doelen.werkdag;

    document.getElementById("doelWeekend").value =
        doelen.weekend;

    document.getElementById("doelVrijedag").value =
        doelen.vrijedag;

    document.getElementById("doelZiek").value =
        doelen.ziek;

}

function slaDoelenOp(){

    doelen.werkdag =
        Number(document.getElementById("doelWerkdag").value);

    doelen.weekend =
        Number(document.getElementById("doelWeekend").value);

    doelen.vrijedag =
        Number(document.getElementById("doelVrijedag").value);

    doelen.ziek =
        Number(document.getElementById("doelZiek").value);

    localStorage.setItem(

        "doelen",

        JSON.stringify(doelen)

    );

    bepaalDoel();

    alert("Streefdoelen opgeslagen.");

}

function slaDagOp(){

let score = Number(
    document.getElementById("score").innerText
);

let heeftActiviteit = false;

document
.querySelectorAll("#planner select")
.forEach(select=>{

    if(select.selectedIndex > 0){

        heeftActiviteit = true;

    }

});

if(!heeftActiviteit){

    alert("Plan eerst minimaal één activiteit.");

    return;

}

    let nieuweDag = {

    datum: datumSleutel(),

   score: score,

    dagtype:
        document.getElementById("dagtype").value,

    resultaat:
        document.getElementById("resultaat").innerText

};

let index = geschiedenis.findIndex(

    dag => dag.datum === nieuweDag.datum

);

let melding = "";

if(index >= 0){

    geschiedenis[index] = nieuweDag;

    melding = "Dag bijgewerkt.";

}
else{

    geschiedenis.push(nieuweDag);

    melding = "Nieuwe dag opgeslagen.";

}

    localStorage.setItem(

        "geschiedenis",

        JSON.stringify(geschiedenis)

    );

    tekenGeschiedenis();
tekenDashboard();
tekenGrafiek();
tekenInzichten();
tekenAdvies();

planningGewijzigd = false;

    alert(melding);

}

function tekenGeschiedenis(){

    let html = "";

    geschiedenis.forEach(dag=>{

        html += `

<p>

    <b>${dag.datum}</b><br>

    Dagtype: ${dag.dagtype}<br>

    Score: ${dag.score}<br>

    Resultaat: ${dag.resultaat}

</p>

`;

    });

    if(html===""){

        html = "Nog geen opgeslagen dagen.";

    }

    document.getElementById("geschiedenis").innerHTML = html;

}

function tekenDashboard(){

console.log("Dashboard gestart");
console.log(geschiedenis);

    if(geschiedenis.length === 0){



        document.getElementById("dashboard").innerHTML =
            "Nog geen gegevens.";

        return;

    }


    let totaal = 0;
    let hoogste = geschiedenis[0].score;
    let laagste = geschiedenis[0].score;

    geschiedenis.forEach(dag=>{

        totaal += dag.score;

        if(dag.score > hoogste){

            hoogste = dag.score;

        }

        if(dag.score < laagste){

            laagste = dag.score;

        }

    });

    let gemiddelde =
        (totaal / geschiedenis.length).toFixed(1);

let werkdagen =
    geschiedenis.filter(
        dag => dag.dagtype === "werkdag"
    );

let gemiddeldeWerkdag = "-";

if(werkdagen.length > 0){

    let totaalWerkdag = 0;

    werkdagen.forEach(dag=>{

        totaalWerkdag += dag.score;

    });

    gemiddeldeWerkdag =
        (totaalWerkdag / werkdagen.length).toFixed(1);

}

let weekenddagen =
    geschiedenis.filter(
        dag => dag.dagtype === "weekend"
    );

let gemiddeldeWeekend = "-";

if(weekenddagen.length > 0){

    let totaalWeekend = 0;

    weekenddagen.forEach(dag=>{

        totaalWeekend += dag.score;

    });

    gemiddeldeWeekend =
        (totaalWeekend / weekenddagen.length).toFixed(1);

}

let vrijeDagen =
    geschiedenis.filter(
        dag => dag.dagtype === "vrijedag"
    );

let gemiddeldeVrijeDag = "-";

if(vrijeDagen.length > 0){

    let totaalVrijeDag = 0;

    vrijeDagen.forEach(dag=>{

        totaalVrijeDag += dag.score;

    });

    gemiddeldeVrijeDag =
        (totaalVrijeDag / vrijeDagen.length).toFixed(1);

}

let ziekteDagen =
    geschiedenis.filter(
        dag => dag.dagtype === "ziek"
    );

let gemiddeldeZiek = "-";

if(ziekteDagen.length > 0){

    let totaalZiek = 0;

    ziekteDagen.forEach(dag=>{

        totaalZiek += dag.score;

    });

    gemiddeldeZiek =
        (totaalZiek / ziekteDagen.length).toFixed(1);

}

let meesteDagen = "-";

let percentageWerkdagen = 0;

if(geschiedenis.length > 0){

    percentageWerkdagen = (

        werkdagen.length / geschiedenis.length * 100

    ).toFixed(1);

}

let categorieTeller = {};

activiteiten.forEach(a=>{

    if(!categorieTeller[a.categorie]){

        categorieTeller[a.categorie] = 0;

    }

    categorieTeller[a.categorie]++;

});

let populairsteCategorie = "-";
let hoogsteCategorie = 0;

Object.keys(categorieTeller).forEach(categorie=>{

    if(categorieTeller[categorie] > hoogsteCategorie){

        hoogsteCategorie =
            categorieTeller[categorie];

        populairsteCategorie =
            categorie;

    }

});

let hoogsteAantal = 0;

Object.keys(doelen).forEach(type=>{

    let aantal = geschiedenis.filter(

        dag => dag.dagtype === type

    ).length;

    if(aantal > hoogsteAantal){

        hoogsteAantal = aantal;
        meesteDagen = type;

    }

});
   
 document.getElementById("dashboard").innerHTML = `

        <p><b>Aantal dagen:</b> ${geschiedenis.length}</p>

        <p><b>Gemiddelde score:</b> ${gemiddelde}</p>

        <p><b>Hoogste score:</b> ${hoogste}</p>

        <p><b>Laagste score:</b> ${laagste}</p>

<p><b>Meest gekozen dagtype:</b> ${meesteDagen}</p>
<p><b>Werkdagen (%):</b> ${percentageWerkdagen}%</p>
<p><b>Meest gebruikte categorie:</b> ${populairsteCategorie}</p>

<p>
<b>Werkdagen:</b>
${werkdagen.length}
(gem. ${gemiddeldeWerkdag})
</p>

<p>
<b>Weekenddagen:</b>
${weekenddagen.length}
(gem. ${gemiddeldeWeekend})
</p>

<p>
<b>Vrije dagen:</b>
${vrijeDagen.length}
(gem. ${gemiddeldeVrijeDag})
</p>

<p>
<b>Ziektedagen:</b>
${ziekteDagen.length}
(gem. ${gemiddeldeZiek})
</p>

    `;

}

function tekenInzichten(){

    if(geschiedenis.length === 0){

        document.getElementById("inzichten").innerHTML =
            "Nog geen gegevens.";

        return;

    }

    let gehaald = 0;

    geschiedenis.forEach(dag=>{

        if(dag.resultaat.includes("🟢")){

            gehaald++;

        }

    });

    let percentage = (

        gehaald / geschiedenis.length * 100

    ).toFixed(0);

let totaalMaand = 0;

let aantalMaand = 0;

geschiedenis.forEach(dag=>{

    let datum = new Date(dag.datum);

    if(

        datum.getMonth() === huidigeMaandDatum.getMonth()

        &&

        datum.getFullYear() === huidigeMaandDatum.getFullYear()

    ){

        totaalMaand += dag.score;

        aantalMaand++;

    }

});

let gemiddeldeMaand = "-";

if(aantalMaand > 0){

    gemiddeldeMaand = (

        totaalMaand / aantalMaand

    ).toFixed(1);

}

let hoogste = 0;

let besteDatum = "-";

geschiedenis.forEach(dag=>{

    if(dag.score > hoogste){

        hoogste = dag.score;

        besteDatum = dag.datum;

    }

});

let maanden = {};

geschiedenis.forEach(dag=>{

    let sleutel = dag.datum.substring(0,7);

    if(!maanden[sleutel]){

        maanden[sleutel] = {

            totaal:0,

            aantal:0

        };

    }

    maanden[sleutel].totaal += dag.score;

    maanden[sleutel].aantal++;

});

let besteMaand = "-";

let besteGemiddelde = Infinity;

Object.keys(maanden).forEach(maand=>{

    let gemiddelde =

        maanden[maand].totaal /

        maanden[maand].aantal;

    if(gemiddelde < besteGemiddelde){

        besteGemiddelde = gemiddelde;

        besteMaand = maand;

    }

});

let laagste = geschiedenis[0].score;

let besteDag = geschiedenis[0].datum;

geschiedenis.forEach(dag=>{

    if(dag.score < laagste){

        laagste = dag.score;

        besteDag = dag.datum;

    }

});

let reeks = 0;

let lijst = [...geschiedenis];

lijst.sort((a,b)=>
    b.datum.localeCompare(a.datum)
);

for(let dag of lijst){

    if(dag.resultaat.includes("🟢")){

        reeks++;

    }
    else{

        break;

    }

}

let langsteReeks = 0;

let huidigeReeks = 0;

lijst.forEach(dag=>{

    if(dag.resultaat.includes("🟢")){

        huidigeReeks++;

        if(huidigeReeks > langsteReeks){

            langsteReeks = huidigeReeks;

        }

    }
    else{

        huidigeReeks = 0;

    }

});

    document.getElementById("inzichten").innerHTML = `

<p><b>🎯 Streefdoel gehaald:</b> ${percentage}%</p>

<p><b>🟢 Gehaalde dagen:</b> ${gehaald}</p>

<p><b>📅 Totaal ingevulde dagen:</b> ${geschiedenis.length}</p>

<hr>

<p><b>📈 Gemiddelde score deze maand:</b> ${gemiddeldeMaand}</p>

<p><b>🗓 Ingevulde dagen deze maand:</b> ${aantalMaand}</p>

<hr>

<p><b>🏆 Hoogste dagscore ooit:</b> ${hoogste}</p>

<p><b>📅 Behaald op:</b> ${besteDatum}</p>

<hr>

<p><b>🥇 Beste maand:</b> ${besteMaand}</p>

<p><b>📊 Gemiddelde score:</b> ${besteGemiddelde.toFixed(1)}</p>

<hr>

<p><b>⭐ Beste dagscore:</b> ${laagste}</p>

<p><b>📅 Behaald op:</b> ${besteDag}</p>

<hr>

<p><b>🔥 Huidige reeks:</b> ${reeks} dag(en)</p>
<p><b>🏆 Langste reeks:</b> ${langsteReeks} dag(en)</p>

`;

}

function tekenAdvies(){

    let advies = "👍 Ga zo door!";

    let totaal = 0;

    geschiedenis.forEach(dag=>{

        totaal += dag.score;

    });

    let gemiddelde = 0;

    if(geschiedenis.length > 0){

        gemiddelde = totaal / geschiedenis.length;

    }

    if(geschiedenis.length === 0){

    advies = "Vul eerst een paar dagen in.";

}
else if(geschiedenis.length < 5){

    advies = "📝 Vul nog een paar dagen in voor een betrouwbaarder persoonlijk advies.";

}
else if(gemiddelde > 5){

    advies = "⚠️ Je gemiddelde belasting is hoog. Plan wat meer rustmomenten.";

}

else if(gemiddelde <= 3){

    advies = "🌟 Je gemiddelde belasting is laag. Blijf je activiteiten goed spreiden.";

}
    else{

        let reeks = 0;

        let lijst = [...geschiedenis];

        lijst.sort((a,b)=>
            b.datum.localeCompare(a.datum)
        );

        for(let dag of lijst){

            if(dag.resultaat.includes("🟢")){

                reeks++;

            }
            else{

                break;

            }

        }

        if(reeks >= 7){

            advies = "🏆 Geweldig! Je hebt al 7 of meer dagen achter elkaar je streefdoel gehaald.";

        }
        else if(reeks >= 3){

            advies = "👏 Je bent goed bezig. Probeer deze reeks vast te houden.";

        }

        let werkdagen = geschiedenis.filter(

            dag => dag.dagtype === "werkdag"

        );

        if(werkdagen.length > 0){

            let totaalWerk = 0;

            werkdagen.forEach(dag=>{

                totaalWerk += dag.score;

            });

            let gemiddeldWerk =

                totaalWerk / werkdagen.length;

            if(gemiddeldWerk > 5){

                advies = "💼 Je werkdagen zijn gemiddeld zwaar. Overweeg minder belastende activiteiten op werkdagen.";

            }

        }

        let laatste7 = geschiedenis.slice(-7);

        if(laatste7.length >= 5){

            let totaal7 = 0;

            laatste7.forEach(dag=>{

                totaal7 += dag.score;

            });

            let gemiddelde7 =

                totaal7 / laatste7.length;

            if(gemiddelde7 > 5){

                advies = "📈 De laatste dagen zijn behoorlijk zwaar. Probeer de komende dagen meer rust in te plannen.";

            }
            else if(gemiddelde7 <= 3){

                advies = "🌟 De laatste week gaat erg goed. Probeer dit ritme vast te houden.";

            }

        }

let rodeDagen = geschiedenis.filter(

    dag => dag.resultaat.includes("🔴")

).length;

if(rodeDagen >= 5){

    advies =

    "🔴 Je hebt veel dagen boven je streefdoel. Kijk of je activiteiten beter kunt spreiden.";

}

    }

    document.getElementById("advies").innerHTML = `

        <p>${advies}</p>

    `;

}

let grafiek = null;

function tekenGrafiek(){

    let canvas = document.getElementById("grafiek");

    if(!canvas){
        return;
    }

    if(grafiek){
        grafiek.destroy();
    }

    let labels = [];
    let scores = [];
let kleuren = [];
let filter =
    document.getElementById("grafiekFilter").value;

let lijst = [...geschiedenis];

if(filter !== "alles"){

    lijst = lijst.slice(-Number(filter));

}

   lijst.forEach(dag=>{

        labels.push(dag.datum);

        scores.push(dag.score);
if(dag.score <= 3){

    kleuren.push("#28a745");

}
else if(dag.score <= 5){

    kleuren.push("#ffc107");

}
else{

    kleuren.push("#dc3545");

}

    });

    grafiek = new Chart(canvas,{

        type: document.getElementById("grafiekType").value,

        data:{

            labels: labels,

            datasets:[{

    label:"Dagscore",

    data: scores,

    borderColor:"#0077cc",

    backgroundColor:"rgba(0,119,204,0.2)",

    pointBackgroundColor: kleuren,

    pointRadius:6,

pointHoverRadius:8,

    fill:true,

    borderWidth:3,

    tension:0.3

}]

        },

        options:{

            responsive:true,

            plugins:{
                legend:{
                    display:true
                }
            },

            scales:{
                y:{
                    beginAtZero:true
                }
            }

        }

    });

}

function wisGeschiedenis(){

    if(!confirm("Geschiedenis wissen?")){

        return;

    }

    geschiedenis = [];

    localStorage.removeItem("geschiedenis");

    tekenGeschiedenis();
tekenDashboard();
tekenGrafiek();
tekenInzichten();
tekenAdvies();

}

function exporteerGegevens(){

   let gegevens = {

    activiteiten: activiteiten,

    geschiedenis: geschiedenis,

    doelen: doelen,

    planning: {}

};

    for(let i=0; i<localStorage.length; i++){

        let sleutel = localStorage.key(i);

        if(sleutel.startsWith("planning_")){

            gegevens.planning[sleutel] =

                JSON.parse(localStorage.getItem(sleutel));

        }

    }

    let tekst = JSON.stringify(gegevens,null,2);

    let blob = new Blob(

        [tekst],

        {type:"application/json"}

    );

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "activiteitenweger_backup.json";

    link.click();

}

function importeerGegevens(){

alert("Import gestart");

    let bestand =
        document.getElementById("importBestand").files[0];

    if(!bestand){

        alert("Kies eerst een bestand.");

        return;

    }

    let reader = new FileReader();

    reader.onload = function(e){

        let gegevens =
            JSON.parse(e.target.result);

        activiteiten =
            gegevens.activiteiten || [];

        geschiedenis =
            gegevens.geschiedenis || [];

doelen =
    gegevens.doelen || doelen;

localStorage.setItem(

    "doelen",

    JSON.stringify(doelen)

);

        localStorage.setItem(
            "activiteiten",
            JSON.stringify(activiteiten)
        );

        localStorage.setItem(
            "geschiedenis",
            JSON.stringify(geschiedenis)
        );

        Object.keys(gegevens.planning || {}).forEach(sleutel=>{

            localStorage.setItem(
                sleutel,
                JSON.stringify(gegevens.planning[sleutel])
            );

        });

        tekenLijst();
laadDoelen();
        laadPlanning();
        tekenGeschiedenis();
        tekenDashboard();
        tekenGrafiek();
tekenInzichten();
tekenAdvies();

        alert("Gegevens succesvol geïmporteerd.");

    };

    reader.readAsText(bestand);

}

function vorigeDag(){

if(planningGewijzigd){

    if(!confirm(
        "Je hebt wijzigingen die nog niet zijn opgeslagen. Toch doorgaan?"
    )){

        return;

    }

}

    huidigeDatum.setDate(
        huidigeDatum.getDate()-1
    );

    toonDatum();
laadPlanning();

}

function volgendeDag(){

if(planningGewijzigd){

    if(!confirm(
        "Je hebt wijzigingen die nog niet zijn opgeslagen. Toch doorgaan?"
    )){

        return;

    }

}

    huidigeDatum.setDate(
        huidigeDatum.getDate()+1
    );

    toonDatum();
laadPlanning();

}

function vandaag(){

if(planningGewijzigd){

    if(!confirm(
        "Je hebt wijzigingen die nog niet zijn opgeslagen. Toch doorgaan?"
    )){

        return;

    }

}

    huidigeDatum = new Date();

    toonDatum();
laadPlanning();

}

// =========================
// Zoeken en sorteren
// =========================

document
.getElementById("zoeken")
.addEventListener("input",tekenLijst);

document
.getElementById("sorteren")
.addEventListener("change",tekenLijst);

// =========================
// Opstarten
// =========================

function toonWeekPlanner(){

    let dagen = [
        "Maandag",
        "Dinsdag",
        "Woensdag",
        "Donderdag",
        "Vrijdag",
        "Zaterdag",
        "Zondag"
    ];

    let html = `
    <table>
        <tr>
           <th>Dag</th>
<th>Datum</th>
<th>Dagtype</th>
<th>Score</th>
<th>Resultaat</th>
        </tr>
    `;

    let begin = new Date(huidigeDatum);

    let dag = begin.getDay();

    if(dag === 0){
        dag = 7;
    }

    begin.setDate(begin.getDate() - dag + 1);

    for(let i = 0; i < 7; i++){

        let datum = new Date(begin);
        datum.setDate(begin.getDate() + i);

        let sleutel = datum.toISOString().split("T")[0];

        let score = "-";
let dagtype = "-";
let resultaat = "-";

let gevonden = geschiedenis.find(
    d => d.datum === sleutel
);

if(gevonden){

    score = gevonden.score;
    dagtype = gevonden.dagtype;
    resultaat = gevonden.resultaat;

}

        let kleur = "";

if(resultaat.includes("🟢")){

    kleur = "#d4edda";

}
else if(resultaat.includes("🟠")){

    kleur = "#fff3cd";

}
else if(resultaat.includes("🔴")){

    kleur = "#f8d7da";

}

html += `
<tr style="background:${kleur}">
            <td>${dagen[i]}</td>
<td>${datum.toLocaleDateString("nl-NL")}</td>
<td>${dagtype}</td>
<td>${score}</td>
<td>${resultaat}</td>
        </tr>
        `;
    }

    html += "</table>";

    document.getElementById("weekplanner").innerHTML = html;
}

let huidigeMaandDatum = new Date();

function toonMaandPlanner(){

let maanden = [
    "Januari","Februari","Maart","April",
    "Mei","Juni","Juli","Augustus",
    "September","Oktober","November","December"
];

document.getElementById("maandTitel").innerText =
    maanden[huidigeMaandDatum.getMonth()] +
    " " +
    huidigeMaandDatum.getFullYear();

    let html = `
    <table>
        <tr>
            <th>Datum</th>
            <th>Dagtype</th>
            <th>Score</th>
            <th>Resultaat</th>
        </tr>
    `;

   let lijst = [...geschiedenis];

lijst.sort((a,b)=>
    a.datum.localeCompare(b.datum)
);

let huidigeMaand =
    huidigeMaandDatum.getMonth();

let aantalDagen = 0;
let totaalScore = 0;
let doelGehaald = 0;
let bovenDoel = 0;

let huidigJaar =
    huidigeMaandDatum.getFullYear();

lijst.forEach(dag=>{

    let datum =
        new Date(dag.datum);

    if(
        datum.getMonth() !== huidigeMaand ||
        datum.getFullYear() !== huidigJaar
    ){
        return;
    }

aantalDagen++;
totaalScore += dag.score;

if(dag.resultaat.includes("🟢")){
    doelGehaald++;
}

if(dag.resultaat.includes("🔴")){
    bovenDoel++;
}

        html += `
        <tr>
            <td>${dag.datum}</td>
            <td>${dag.dagtype}</td>
            <td>${dag.score}</td>
            <td>${dag.resultaat}</td>
        </tr>
        `;

    });

    html += "</table>";

let gemiddelde =
    aantalDagen > 0
    ? (totaalScore / aantalDagen).toFixed(1)
    : 0;

let beoordeling = "⚪ Geen gegevens";

if(aantalDagen > 0){

    if(doelGehaald >= bovenDoel){

        beoordeling = "🟢 Goede maand";

    }else{

        beoordeling = "🟠 Maand kan beter";

    }

}

document.getElementById("maandStatistieken").innerHTML = `

<p><b>Ingevulde dagen:</b> ${aantalDagen}</p>

<p><b>Gemiddelde score:</b> ${gemiddelde}</p>

<p><b>Streefdoel gehaald:</b> ${doelGehaald}</p>

<p><b>Boven streefdoel:</b> ${bovenDoel}</p>

<hr>

<p><b>Beoordeling:</b> ${beoordeling}</p>

`;

    document.getElementById("maandplanner").innerHTML = html;

}

function toonJaarOverzicht(){

    let html = `
    <table>
        <tr>
            <th>Maand</th>
            <th>Aantal dagen</th>
            <th>Gemiddelde score</th>
        </tr>
    `;

    let maanden = [
        "Januari","Februari","Maart","April",
        "Mei","Juni","Juli","Augustus",
        "September","Oktober","November","December"
    ];

    let jaar = huidigeMaandDatum.getFullYear();

let totaalScore = 0;
let totaalDagen = 0;

    for(let m = 0; m < 12; m++){

        let totaal = 0;
        let aantal = 0;

        geschiedenis.forEach(dag=>{

            let datum = new Date(dag.datum);

            if(
                datum.getFullYear() === jaar &&
                datum.getMonth() === m
            ){

                totaal += dag.score;
                aantal++;

totaalScore += dag.score;
totaalDagen++;

            }

        });

        let gemiddelde = "-";

        if(aantal > 0){

            gemiddelde = (totaal / aantal).toFixed(1);

        }

        html += `
        <tr>
            <td>${maanden[m]}</td>
            <td>${aantal}</td>
            <td>${gemiddelde}</td>
        </tr>
        `;

    }

    html += "</table>";

let gemiddeldeJaar =
    totaalDagen > 0
    ? (totaalScore / totaalDagen).toFixed(1)
    : 0;

let beoordeling = "⚪ Geen gegevens";

if(totaalDagen > 0){

    if(gemiddeldeJaar <= 3){

        beoordeling = "🟢 Uitstekend jaar";

    }
    else if(gemiddeldeJaar <= 5){

        beoordeling = "🟡 Goed jaar";

    }
    else{

        beoordeling = "🔴 Verbetering mogelijk";

    }

}

document.getElementById("jaarStatistieken").innerHTML = `
<p><b>Jaar:</b> ${jaar}</p>
<p><b>Totaal ingevulde dagen:</b> ${totaalDagen}</p>
<p><b>Gemiddelde score:</b> ${gemiddeldeJaar}</p>
<hr>
<p><b>Jaarbeoordeling:</b> ${beoordeling}</p>
`;

    document.getElementById("jaaroverzicht").innerHTML = html;

}

function vorigeMaand(){

    huidigeMaandDatum.setMonth(
        huidigeMaandDatum.getMonth() - 1
    );

    toonMaandPlanner();
tekenKalender();

}

function volgendeMaand(){

    huidigeMaandDatum.setMonth(
        huidigeMaandDatum.getMonth() + 1
    );

    toonMaandPlanner();
tekenKalender();

}

function downloadGrafiek(){

    let canvas = document.getElementById("grafiek");

    let link = document.createElement("a");

    link.download = "activiteitenweger_grafiek.png";

    link.href = canvas.toDataURL("image/png");

    link.click();

}

function resetAlles(){

    if(!confirm(
        "Weet je zeker dat je ALLE gegevens wilt wissen?"
    )){

        return;

    }

    localStorage.clear();

    activiteiten = [];

    geschiedenis = [];

    planning = {};

    doelen = {

        werkdag:5,
        weekend:3,
        vrijedag:2,
        ziek:0

    };

    laadDoelen();

    tekenLijst();

    laadPlanning();

    tekenGeschiedenis();

    tekenDashboard();

    tekenGrafiek();

    bepaalDoel();

    alert("Alle gegevens zijn gewist.");

}

function maakPDF(){

    const { jsPDF } = window.jspdf;

    let pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Activiteitenweger 3.0", 20, 20);

    pdf.setFontSize(12);
    pdf.text(
        "Datum: " + new Date().toLocaleDateString("nl-NL"),
        20,
        30
    );

    pdf.text(
        "Aantal opgeslagen dagen: " + geschiedenis.length,
        20,
        40
    );

pdf.text(
    "Aantal activiteiten: " + activiteiten.length,
    20,
    45
);

    pdf.text(
        "Huidige score: " +
        document.getElementById("score").innerText,
        20,
        55
    );

let totaal = 0;

let hoogste = 0;

let laagste = geschiedenis.length > 0
    ? geschiedenis[0].score
    : 0;

geschiedenis.forEach(dag=>{

    totaal += dag.score;

    if(dag.score > hoogste){

        hoogste = dag.score;

    }

    if(dag.score < laagste){

        laagste = dag.score;

    }

});

let gemiddelde =
    geschiedenis.length > 0
    ? (totaal / geschiedenis.length).toFixed(1)
    : 0;

pdf.text(
    "Gemiddelde score: " + gemiddelde,
    20,
    65
);

pdf.text(
    "Hoogste score: " + hoogste,
    20,
    75
);

pdf.text(
    "Laagste score: " + laagste,
    20,
    85
);

    let canvas =
        document.getElementById("grafiek");

    let afbeelding =
        canvas.toDataURL("image/png");

    pdf.addImage(
    afbeelding,
    "PNG",
    15,
    100,
    180,
    90
);

 pdf.setFontSize(10);

pdf.text(
    "Gegenereerd door Activiteitenweger 3.0",
    20,
    285
);

pdf.text(
    "Pagina 1",
    170,
    285
);   
let y = 205;

pdf.setFontSize(14);
pdf.text("Activiteiten", 20, y);

y += 10;

pdf.setFontSize(10);

activiteiten.forEach(a=>{

    if(y > 275){

        pdf.addPage();

        y = 20;

        pdf.setFontSize(14);

        pdf.text("Activiteiten (vervolg)", 20, y);

        y += 10;

        pdf.setFontSize(10);

    }

    pdf.text(

        a.naam +
        " (" +
        a.categorie +
        ") - " +
        a.waarde,

        20,

        y

    );

    y += 6;

});

y += 10;

if(y > 260){

    pdf.addPage();

    y = 20;

}

pdf.setFontSize(14);

pdf.text("Geschiedenis", 20, y);

y += 10;

pdf.setFontSize(10);

geschiedenis.forEach(dag=>{

    if(y > 275){

        pdf.addPage();

        y = 20;

        pdf.setFontSize(14);

        pdf.text("Geschiedenis (vervolg)",20,y);

        y += 10;

        pdf.setFontSize(10);

    }

    pdf.text(

        dag.datum +
        " | " +
        dag.dagtype +
        " | Score: " +
        dag.score,

        20,

        y

    );

    y += 6;

});

pdf.save("Activiteitenweger_Rapport.pdf");

}

function tekenKalender(){

let maanden = [
    "Januari","Februari","Maart","April",
    "Mei","Juni","Juli","Augustus",
    "September","Oktober","November","December"
];

document.getElementById("kalenderTitel").innerText =
    maanden[huidigeMaandDatum.getMonth()] +
    " " +
    huidigeMaandDatum.getFullYear();

    let html = `
    <table>
        <tr>
            <th>Ma</th>
            <th>Di</th>
            <th>Wo</th>
            <th>Do</th>
            <th>Vr</th>
            <th>Za</th>
            <th>Zo</th>
        </tr>
    `;

    let eersteDag = new Date(
        huidigeMaandDatum.getFullYear(),
        huidigeMaandDatum.getMonth(),
        1
    );

    let eersteWeekdag = eersteDag.getDay();

    if(eersteWeekdag === 0){
        eersteWeekdag = 7;
    }

    let aantalDagen = new Date(
        huidigeMaandDatum.getFullYear(),
        huidigeMaandDatum.getMonth() + 1,
        0
    ).getDate();

    html += "<tr>";

    for(let i = 1; i < eersteWeekdag; i++){
        html += "<td></td>";
    }

    let kolom = eersteWeekdag;

    for(let dag = 1; dag <= aantalDagen; dag++){

       let datumTekst =
    huidigeMaandDatum.getFullYear() +
    "-" +
    String(huidigeMaandDatum.getMonth() + 1).padStart(2,"0") +
    "-" +
    String(dag).padStart(2,"0");

let gevonden = geschiedenis.find(
    d => d.datum === datumTekst
);

let kleur = "";

if(gevonden){

    if(gevonden.resultaat.includes("🟢")){

        kleur = "#d4edda";

    }
    else if(gevonden.resultaat.includes("🟠")){

        kleur = "#fff3cd";

    }
    else if(gevonden.resultaat.includes("🔴")){

        kleur = "#f8d7da";

    }

}

let score = "";

if(gevonden){

    score = gevonden.score;

}

let rand = "";

let vandaag = new Date().toISOString().split("T")[0];

if(datumTekst === vandaag){

    rand = "3px solid #0077cc";

}

html += `
<<td
onclick="openDag('${datumTekst}')"
style="
    background:${kleur};
    border:${rand};
    text-align:center;
    vertical-align:top;
    height:60px;
    cursor:pointer;
">

    <b>${dag}</b><br>

    <small>${score}</small>

</td>
`;

        if(kolom === 7){

            html += "</tr>";

            if(dag !== aantalDagen){
                html += "<tr>";
            }

            kolom = 1;

        }else{

            kolom++;

        }

    }

    while(kolom > 1 && kolom <= 7){

        html += "<td></td>";

        kolom++;

    }

    html += "</tr>";
    html += "</table>";

    document.getElementById("kalender").innerHTML = html;

}

function openDag(datum){

    huidigeDatum = new Date(datum);

    toonDatum();

    laadPlanning();

}

function toonWerkdag(){

    document.getElementById("startUur").value = 8;
    document.getElementById("eindUur").value = 18;

    laadPlanning();

}

function toonOchtend(){

    document.getElementById("startUur").value = 6;
    document.getElementById("eindUur").value = 12;

    laadPlanning();

}

function toonMiddag(){

    document.getElementById("startUur").value = 12;
    document.getElementById("eindUur").value = 18;

    laadPlanning();

}

function toonAvond(){

    document.getElementById("startUur").value = 18;
    document.getElementById("eindUur").value = 24;

    laadPlanning();

}

function toonAlles(){

    document.getElementById("startUur").value = 0;
    document.getElementById("eindUur").value = 24;

    laadPlanning();

}

tekenLijst();
vulTijden();
tekenPlanner();
toonDatum();
laadPlanning();
tekenGeschiedenis();
tekenDashboard();
tekenGrafiek();
laadDoelen();
bepaalDoel();
toonMaandPlanner();
tekenKalender();
toonJaarOverzicht();
tekenInzichten();
tekenAdvies();