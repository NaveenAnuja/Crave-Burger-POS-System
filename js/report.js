document.addEventListener("DOMContentLoaded", () => {
    const paymentHistory = JSON.parse(localStorage.getItem('paymentHistory')) || [];

    displayPaymentHistory(paymentHistory);

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });
});

function displayPaymentHistory(payments) {
    const tbody = document.getElementById("payment-history");
    tbody.innerHTML = '';

    payments.sort((a, b) => a.id - b.id);

    payments.forEach(payment => {
        const tr = document.createElement("tr");

        const formattedDate = new Date(payment.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const paymentTime = new Date(payment.timestamp || payment.date);
        const formattedTime = paymentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        tr.innerHTML = `
            <td>${payment.id}</td>
            <td>${formattedDate}</td>
            <td>${formattedTime}</td>
            <td>${payment.orderId}</td>
            <td>LKR ${payment.total.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function downloadReceipt() {
    if (typeof html2pdf === 'undefined') {
        Swal.fire({
            title: 'Error',
            text: 'PDF library not loaded. Please try again.',
            icon: 'error'
        });
        console.error('html2pdf library not loaded');
        return;
    }

    const element = document.querySelector(".report-container");

    if (!element) {
        Swal.fire({
            title: 'Error',
            text: 'Could not find report content.',
            icon: 'error'
        });
        console.error('Report container element not found');
        return;
    }

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `CraveBurgers_Receipt_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    Swal.fire({
        title: 'Generating Receipt',
        html: 'Please wait while we prepare your download...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
            Swal.fire({
                title: 'Download Complete',
                text: 'Your receipt has been downloaded successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        })
        .catch(err => {
            console.error('PDF generation failed:', err);
            Swal.fire({
                title: 'Error',
                text: 'Failed to generate receipt. Please try again.',
                icon: 'error'
            });
        });
}

document.getElementById('logoutButton').addEventListener('click', function (e) {
    e.preventDefault();

    localStorage.clear();

    Swal.fire({
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
    
        window.location.href = 'login.html';
    });
});
