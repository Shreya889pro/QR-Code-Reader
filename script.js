const wrapper = document.querySelector(".wrapper");
const form = document.querySelector("form");
const fileInp = document.querySelector("input");
const infoText = document.querySelector("p");
const closeBtn = document.querySelector(".close");
const copyBtn = document.querySelector(".copy");

// Fetch Data From API

function fetchRequest(file, formData) {
    infoText.innerText = "Scanning QR Code...";
    
    fetch("https://zxing.org/w/decode", {
        method: 'POST',
        body: formData
    }).then(res => res.text()) // Parsing as text
    .then(result => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(result, "text/html");
        let qrData = doc.querySelector("body").textContent.trim();
        
        infoText.innerText = qrData ? "QR Code Scanned Successfully!" : "Couldn't Scan QR Code. Try with a different file.";
        if (!qrData) return;

        document.querySelector("textarea").innerText = qrData;
        form.querySelector("img").src = URL.createObjectURL(file);
        wrapper.classList.add("active");
    }).catch(err => {
        console.error(err);
        infoText.innerText = "Couldn't Scan QR Code. Please check your connection and try again.";
    });
}

// Send QR Code File With Request To API
fileInp.addEventListener("change", async e => {
    let file = e.target.files[0];
    if (!file) return;
    let formData = new FormData();
    formData.append('file', file);
    fetchRequest(file, formData);
});

// Copy Text To Clipboard
copyBtn.addEventListener("click", () => {
    let text = document.querySelector("textarea").textContent;
    navigator.clipboard.writeText(text);
});

// When user clicks on form, trigger fileInp event listener function
form.addEventListener("click", () => fileInp.click());

closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));
