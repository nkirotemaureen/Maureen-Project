document.addEventListener("DOMContentLoaded", () => {
  fetchTickets();

  document.getElementById("ticketForm").addEventListener("submit", addTicket);
  document
    .getElementById("filterStatus")
    .addEventListener("change", filterTickets);
});

async function fetchTickets() {
  const response = await fetch("http://localhost:3000/tickets");
  const tickets = await response.json();
  displayTickets(tickets);
}

function displayTickets(tickets) {
  const ticketList = document.getElementById("ticketList");
  ticketList.innerHTML = "";

  tickets.forEach((ticket) => {
    const ticketDiv = document.createElement("div");
    ticketDiv.classList.add("ticket");
    ticketDiv.innerHTML = ` 
<h3>${ticket.title}</h3> 
<p>${ticket.description}</p> 
<p>Status: <strong>${ticket.status}</strong></p> 
<p>Priority: ${ticket.priority}</p> 
${
  ticket.status === "open"
    ? `<button onclick="resolveTicket(${ticket.id})">Resolve</button>`
    : ""
} 
`;
    ticketList.appendChild(ticketDiv);
  });
}

async function addTicket(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const priority = document.getElementById("priority").value;

  const newTicket = { title, description, status: "open", priority };

  const response = await fetch("http://localhost:3000/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTicket),
  });

  if (response.ok) {
    fetchTickets();
    document.getElementById("ticketForm").reset();
  }
}

async function resolveTicket(id) {
  await fetch(`http://localhost:3000/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "resolved" }),
  });

  fetchTickets();
}

async function filterTickets() {
  const status = document.getElementById("filterStatus").value;
  const response = await fetch("http://localhost:3000/tickets");
  let tickets = await response.json();

  if (status !== "all") {
    tickets = tickets.filter((ticket) => ticket.status === status);
  }

  displayTickets(tickets);
}
