const apiUrl = "/api/quotes";

let deleteQuoteId = null;
const modal = document.getElementById("delete-modal");
const confirmBtn = document.getElementById("confirm-delete");
const cancelBtn = document.getElementById("cancel-delete");
const notification = document.getElementById("notification");

function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function makeColumnsResizable(table) {
  const thElements = table.querySelectorAll("th");

  thElements.forEach((th) => {
    const resizer = document.createElement("div");
    resizer.classList.add("resizer");
    th.appendChild(resizer);
    resizer.addEventListener("mousedown", initResize);

    function initResize(e) {
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    }

    function resize(e) {
      const rect = th.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      if (newWidth > 40) {
        th.style.width = newWidth + "px";
      }
    }

    function stopResize() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    }
  });
}


function fetchAndRenderQuotes() {
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => renderQuotes(data.quotes));
}

function renderQuotes(quotes) {
  const tbody = document.querySelector("#quotes-table tbody");
  tbody.innerHTML = quotes
    .map(
      (quote) => `
      <tr data-id="${quote.id}">
        <td>${quote.id}</td>
        <td><input type="text" value="${quote.person}" disabled></td>
        <td><input type="text" value="${quote.year || ""}" disabled></td>
        <td><input type="text" value="${quote.quote}" disabled></td>
        <td>
          <button class="edit" title="Edit">&#9998;</button>
          <button class="delete" title="Delete">&#128465;</button>
        </td>
      </tr>
    `
    )
    .join("");

  document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", handleEditClick);
  });

  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", handleDeleteClick);
  });
}

function handleEditClick(e) {
  const row = e.target.closest("tr");
  const inputs = row.querySelectorAll("input");

  const isEditable = !inputs[0].disabled;

  if (!isEditable) {
    inputs.forEach((input) => (input.disabled = false));
    inputs[0].focus();

    function saveOnEnter(event) {
      if (event.key === "Enter") {
        const id = row.getAttribute("data-id");
        const updatedQuote = {
          person: inputs[0].value,
          year: inputs[1].value,
          quote: inputs[2].value,
        };

        // PUT request
        const query = new URLSearchParams(updatedQuote).toString();

        fetch(`${apiUrl}/${id}?${query}`, {
          method: "PUT",
        }).then((res) => {
          if (res.ok) {
            inputs.forEach((input) => (input.disabled = true));
            showNotification("Quote updated successfully!");
          } else {
            showNotification("Failed to update quote.");
          }
        });

        row.removeEventListener("keydown", saveOnEnter);
      }
    }

    row.addEventListener("keydown", saveOnEnter);
  }
}

function handleDeleteClick(e) {
  const row = e.target.closest("tr");
  deleteQuoteId = row.getAttribute("data-id");
  modal.classList.remove("hidden");
}

confirmBtn.addEventListener("click", () => {
  if (deleteQuoteId !== null) {
    fetch(`${apiUrl}/${deleteQuoteId}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        showNotification("Quote deleted successfully!");
        fetchAndRenderQuotes();
      } else {
        showNotification("Failed to delete quote.");
      }
    });

    deleteQuoteId = null;
    modal.classList.add("hidden");
  }
});

cancelBtn.addEventListener("click", () => {
  deleteQuoteId = null;
  modal.classList.add("hidden");
});

fetchAndRenderQuotes();

document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderQuotes();
  makeColumnsResizable(document.getElementById("quotes-table"));
});
