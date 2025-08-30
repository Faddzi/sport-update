// Sports Hub script
// Edit this line with your API key from football-data.org
const FOOTBALL_API_KEY = "	13198cf60da542669adaff8532eb2085";

function setStatus(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// FOOTBALL
async function loadFootball() {
  const list = document.getElementById("football-list");
  try {
    setStatus("football-status", "Loading");
    const url = "https://api.football-data.org/v4/matches?status=LIVE,SCHEDULED";
    const res = await fetch(url, { headers: { "X-Auth-Token": FOOTBALL_API_KEY } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const matches = (data.matches || []).slice(0, 8);
    if (matches.length === 0) {
      list.innerHTML = "<li>No upcoming or live matches found</li>";
    } else {
      list.innerHTML = matches.map(m => {
        const home = m.homeTeam?.name || "Home";
        const away = m.awayTeam?.name || "Away";
        const comp = m.competition?.name || "Competition";
        const status = m.status || "TBD";
        const date = m.utcDate ? new Date(m.utcDate).toLocaleString() : "";
        return `<li>
          <div><strong>${home}</strong> vs <strong>${away}</strong></div>
          <div class="meta">${comp} • ${status} • ${date}</div>
        </li>`;
      }).join("");
    }
    setStatus("football-status", "OK");
  } catch (err) {
    console.error(err);
    setStatus("football-status", "Error");
    list.innerHTML = `<li>Could not load football data. Add your API key in script.js then reload.</li>`;
  }
}

// CHESS
async function loadChess() {
  const list = document.getElementById("chess-list");
  try {
    setStatus("chess-status", "Loading");
    const res = await fetch("https://api.chess.com/pub/titled/GM");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const players = (data.players || []).slice(0, 10);
    list.innerHTML = players.map(u => `<li>${u}</li>`).join("");
    setStatus("chess-status", "OK");
  } catch (err) {
    console.error(err);
    setStatus("chess-status", "Error");
    list.innerHTML = "<li>Could not load chess data</li>";
  }
}

// F1
async function loadF1() {
  const list = document.getElementById("f1-list");
  const nextBox = document.getElementById("f1-next");
  try {
    setStatus("f1-status", "Loading");
    // Next race
    const nextRes = await fetch("https://ergast.com/api/f1/current/next.json");
    if (nextRes.ok) {
      const nextData = await nextRes.json();
      const race = nextData?.MRData?.RaceTable?.Races?.[0];
      if (race) {
        nextBox.innerHTML = `<div><strong>Next race</strong>: ${race.raceName} in ${race.Circuit?.Location?.locality}, ${race.Circuit?.Location?.country}</div>
        <div class="meta">Date and time ${race.date} ${race.time || ""}</div>`;
      }
    }
    // Driver standings
    const res = await fetch("https://ergast.com/api/f1/current/driverStandings.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings.slice(0, 10);
    list.innerHTML = standings.map(s => {
      const name = s.Driver.givenName + " " + s.Driver.familyName;
      return `<li><div><strong>${name}</strong></div><div class="meta">${s.points} pts • P${s.position}</div></li>`;
    }).join("");
    setStatus("f1-status", "OK");
  } catch (err) {
    console.error(err);
    setStatus("f1-status", "Error");
    list.innerHTML = "<li>Could not load F1 data</li>";
  }
}

// Football API
const url = "https://api.football-data.org/v4/matches";
fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(url), {
  headers: { "X-Auth-Token": FOOTBALL_API_KEY }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));


loadFootball();
loadChess();
loadF1();
