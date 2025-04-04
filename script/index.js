document.addEventListener("DOMContentLoaded", () => {
    fetchTickets();

    document.getElementById("ticketForm").addEventListener("submit", addTicket);
    document.getElementById("filterStatus").addEventListener("change", filterTickets);
    document.getElementById("search").addEventListener("input", filterBySearch);
    document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);
});

let tickets = []; 

async function fetchTickets() {
    const response = await fetch("http://localhost:3000/tickets");
    tickets = await response.json();
    displayTickets(tickets);
}

function displayTickets(ticketsToDisplay) {
    const ticketList = document.getElementById("ticketList");
    ticketList.innerHTML = "";

    ticketsToDisplay.forEach((ticket) => {
        const ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
        ticketDiv.innerHTML = ` 
            <h3>${ticket.title}</h3> 
            <p>${ticket.description}</p> 
            <p>Status: <strong>${ticket.status}</strong></p> 
            <p>Priority: ${ticket.priority}</p> 
            ${ticket.status === "open" ? `<button onclick="resolveTicket(${ticket.id})">Resolve</button>` : ""} 
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
    let filteredTickets = tickets;

    if (status !== "all") {
        filteredTickets = filteredTickets.filter((ticket) => ticket.status === status);
    }

    displayTickets(filteredTickets);
}

function filterBySearch() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filteredTickets = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm)
    );
    displayTickets(filteredTickets);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
