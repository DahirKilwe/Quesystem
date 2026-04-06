// Tilstand
const queue = [];
const nowServing = {}; // room -> person
const rooms = ["1", "2"]; // start med to rom
let ticketCounter = 101;

// Elementer
const queueList = document.getElementById("queue-list");
const emptyState = document.getElementById("empty-state");
const myTicketEl = document.getElementById("my-ticket");
const myPosEl = document.getElementById("my-pos");
const myEtaEl = document.getElementById("my-eta");
const myAheadEl = document.getElementById("my-ahead");
const roomsWrap = document.getElementById("rooms");

const nameInput = document.getElementById("p-name");
const reasonInput = document.getElementById("p-reason");
const ticketBtn = document.getElementById("ticket-btn");
const peekBtn = document.getElementById("peek-btn");

const resetBtn = document.getElementById("reset-btn");
const addRoomBtn = document.getElementById("add-room-btn");
const newRoomInput = document.getElementById("new-room");
const avgMinInput = document.getElementById("avg-min");

// Hent min ticket fra session storage
let myTicket = sessionStorage.getItem("my-ticket") || null;

const generateTicket = () => `B${ticketCounter++}`;

const formatEta = (pos) => {
  const mins = Math.max(0, pos - 1) * Number(avgMinInput.value || 7);
  if (mins === 0) return "Nå";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}t ${m}m`;
};

const renderRooms = () => {
  roomsWrap.innerHTML = "";
  rooms.forEach((room) => {
    const current = nowServing[room];
    const card = document.createElement("div");
    card.className = "room-card";
    card.innerHTML = `
      <div class="room-head">
        <div>
          <div class="label">Rom</div>
          <div class="room-title">${room}</div>
        </div>
        <div class="tag">${current ? current.ticket : "—"}</div>
      </div>
      <div class="muted">${current ? `${current.name}${current.reason ? " · " + current.reason : ""}` : "Ingen kalles nå."}</div>
      <div class="mini">
        <button data-room="${room}" class="call">Kall neste</button>
        <button data-room="${room}" class="announce secondary">Annonsér</button>
        <button data-room="${room}" class="danger clear-room">Frigjør</button>
      </div>
    `;
    roomsWrap.appendChild(card);
  });

  roomsWrap.querySelectorAll(".call").forEach((btn) => btn.onclick = () => callNext(btn.dataset.room));
  roomsWrap.querySelectorAll(".announce").forEach((btn) => btn.onclick = () => announceRoom(btn.dataset.room));
  roomsWrap.querySelectorAll(".clear-room").forEach((btn) => btn.onclick = () => clearRoom(btn.dataset.room));
};

const renderQueue = () => {
  queueList.innerHTML = "";
  emptyState.style.display = queue.length ? "none" : "block";

  queue.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <span class="tag">${item.ticket}</span>
      <span class="name">${item.name}</span>
      <span class="muted">Posisjon ${idx + 1}${item.reason ? " · " + item.reason : ""}</span>
    `;
    queueList.appendChild(li);
  });

  if (myTicket) {
    const pos = queue.findIndex((q) => q.ticket === myTicket);
    const inRoom = Object.values(nowServing).find((p) => p?.ticket === myTicket);
    if (pos === -1 && inRoom) {
      myPosEl.textContent = `Til behandling · Rom ${inRoom.room}`;
      myAheadEl.textContent = 0;
      myEtaEl.textContent = "—";
    } else if (pos === -1) {
      myPosEl.textContent = "Ferdig";
      myAheadEl.textContent = 0;
      myEtaEl.textContent = "—";
    } else {
      myPosEl.textContent = pos + 1;
      myAheadEl.textContent = pos;
      myEtaEl.textContent = formatEta(pos + 1);
    }
    myTicketEl.textContent = myTicket;
  } else {
    myTicketEl.textContent = "—";
    myPosEl.textContent = "—";
    myAheadEl.textContent = "—";
    myEtaEl.textContent = "—";
  }
};

const issueTicket = () => {
  const ticket = generateTicket();
  const name = nameInput.value.trim() || "Pasient";
  const reason = reasonInput.value.trim();
  queue.push({ ticket, name, reason });
  myTicket = ticket;
  sessionStorage.setItem("my-ticket", ticket);
  nameInput.value = "";
  reasonInput.value = "";
  renderQueue();
  alert(`Din kølapp er ${ticket}.`);
};

const peekMine = () => {
  if (!myTicket) return alert("Du har ikke tatt en kølapp enda.");
  const pos = queue.findIndex((q) => q.ticket === myTicket);
  const inRoom = Object.values(nowServing).find((p) => p?.ticket === myTicket);
  if (pos === -1 && inRoom) {
    alert(`Det er din tur nå (${myTicket}) – gå til rom ${inRoom.room}.`);
  } else if (pos === -1) {
    alert(`Din ticket ${myTicket} er ferdig behandlet.`);
  } else {
    alert(`Du er nummer ${pos + 1} i kø. Estimat: ${formatEta(pos + 1)}.`);
  }
};

const callNext = (room) => {
  if (!queue.length) return alert("Ingen i køen.");
  const patient = { ...queue.shift(), room };
  nowServing[room] = patient;
  renderQueue();
  renderRooms();
  announceRoom(room);
};

const announceRoom = (room) => {
  const item = nowServing[room];
  if (!item) return alert(`Ingen pasient tilknyttet rom ${room}.`);
  alert(`Kølapp ${item.ticket}, ${item.name}. Gå til rom ${room}.`);
};

const resetAll = () => {
  if (!confirm("Nullstill hele køen og alle rom?")) return;
  queue.length = 0;
  Object.keys(nowServing).forEach((r) => delete nowServing[r]);
  myTicket = null;
  sessionStorage.removeItem("my-ticket");
  renderQueue();
  renderRooms();
};

const addRoom = () => {
  const room = (newRoomInput.value || "").trim();
  if (!room) return alert("Skriv inn romnavn.");
  if (rooms.includes(room)) return alert("Rom finnes allerede.");
  rooms.push(room);
  newRoomInput.value = "";
  renderRooms();
};

const clearRoom = (room) => {
  delete nowServing[room];
  renderRooms();
};

// Event listeners
ticketBtn.addEventListener("click", issueTicket);
peekBtn.addEventListener("click", peekMine);
addRoomBtn.addEventListener("click", addRoom);
resetBtn.addEventListener("click", resetAll);

nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") issueTicket(); });
reasonInput.addEventListener("keydown", (e) => { if (e.key === "Enter") issueTicket(); });

// Init
renderQueue();
renderRooms();
