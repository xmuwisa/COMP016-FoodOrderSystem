lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
    const receiptsList = document.getElementById("receiptsList");
    const receiptDetailsOverlay = document.getElementById(
        "receiptDetailsOverlay"
    );
    const receiptDetailsContent = document.getElementById(
        "receiptDetailsContent"
    );
    const closeDetailsBtn = document.getElementById("closeDetailsBtn");

    let receipts = JSON.parse(localStorage.getItem("receipts")) || [];

    function renderReceipts() {
        if (receipts.length === 0) {
            receiptsList.innerHTML = "<p>No receipts found.</p>";
            return;
        }

        let html = "";
        receipts.forEach((receipt, index) => {
            html += `
          <div style="border: 1px solid #000; margin-bottom: 10px; padding: 10px;">
            <p>Receipt No: <strong>${receipt.receiptNumber}</strong></p>
            <p>Date/Time: ${receipt.dateTime}</p>
            <p>Total: ₱${receipt.total}</p>
            <button class="viewReceiptBtn" data-index="${index}">View Details</button>
          </div>
        `;
        });

        receiptsList.innerHTML = html;

        const viewButtons = document.querySelectorAll(".viewReceiptBtn");
        viewButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                showReceiptDetails(idx);
            });
        });
    }

    function showReceiptDetails(index) {
        const r = receipts[index];
        if (!r) return;
        let detailsHtml = `
        <h2>Receipt # ${r.receiptNumber}</h2>
        <p><strong>Date/Time:</strong> ${r.dateTime}</p>
        <p><strong>Name:</strong> ${r.name}</p>
        <p><strong>Contact:</strong> ${r.contact}</p>
        <p><strong>Notes:</strong> ${r.notes}</p>
        <p><strong>Order Type:</strong> ${r.orderType}</p>
        <h3>Items:</h3>
      `;

        r.items.forEach((item) => {
            detailsHtml += `
          <div style="margin-left: 20px;">
            <p>
              <strong>${item.name}</strong>
              (Qty: ${item.quantity})
              ${
                  item.option
                      ? `(${item.type === "sushi" ? "Spice:" : "Size:"} ${
                            item.option
                        })`
                      : ""
              }
            </p>
            <p>Subtotal: ₱${item.totalCost}</p>
          </div>
        `;
        });

        if (r.extras && r.extras.length > 0) {
            detailsHtml += `<h3>Extras:</h3>`;
            r.extras.forEach((ex) => {
                detailsHtml += `
            <p style="margin-left: 20px;">
              ${ex.name} - ₱${ex.cost}
            </p>
          `;
            });
        }

        detailsHtml += `<h2>Total: ₱${r.total}</h2>`;

        receiptDetailsContent.innerHTML = detailsHtml;
        receiptDetailsOverlay.style.display = "flex";
    }

    closeDetailsBtn.addEventListener("click", () => {
        receiptDetailsOverlay.style.display = "none";
    });

    renderReceipts();
});
