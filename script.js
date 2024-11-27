// Elements
const fileInput = document.getElementById("file-input");
const uploadArea = document.getElementById("upload-area");
const pdfViewer = document.getElementById("pdf-viewer");
const textViewer = document.getElementById("text-viewer");
const codeViewer = document.getElementById("code-viewer");
const viewer = document.getElementById("viewer");

// Event Listener for File Upload
uploadArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", handleFile);

// Drag-and-Drop Support
uploadArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    uploadArea.classList.add("dragging");
});

uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragging");
});

uploadArea.addEventListener("drop", (event) => {
    event.preventDefault();
    uploadArea.classList.remove("dragging");
    const file = event.dataTransfer.files[0];
    if (file) handleFile({ target: { files: [file] } });
});

// Handle File Upload
async function handleFile(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected. Please choose a file.");
        return;
    }

    const fileType = file.type;
    const fileName = file.name;
    console.log(`File uploaded: ${fileName} (Type: ${fileType})`);

    // Reset and Hide All Viewers
    hideAllViewers();

    try {
        // Process File Based on Type
        if (fileType === "application/pdf") {
            renderPDF(file);
        } else if (fileType.startsWith("text/") || fileType === "application/json") {
            await renderText(file);
        } else {
            alert(`Unsupported file type: ${fileName}. Please upload a PDF, text, or JSON file.`);
        }
    } catch (error) {
        console.error("Error handling file:", error);
        alert("An error occurred while processing the file. Please try again.");
    }
}

// Render PDF Files
function renderPDF(file) {
    const fileURL = URL.createObjectURL(file);
    pdfViewer.src = fileURL;
    pdfViewer.classList.remove("hidden");
    viewer.classList.remove("hidden");
    console.log("PDF file displayed.");
}

// Render Text or JSON Files
async function renderText(file) {
    try {
        const text = await file.text();
        if (file.type === "application/json") {
            // Pretty-print JSON
            codeViewer.textContent = JSON.stringify(JSON.parse(text), null, 2);
            codeViewer.classList.remove("hidden");
        } else {
            // Display Plain Text
            textViewer.value = text;
            textViewer.classList.remove("hidden");
        }
        viewer.classList.remove("hidden");
        console.log("Text file displayed.");
    } catch (error) {
        console.error("Error reading text file:", error);
        alert("Failed to read the file. Please try again.");
    }
}

// Hide All Viewers
function hideAllViewers() {
    pdfViewer.classList.add("hidden");
    textViewer.classList.add("hidden");
    codeViewer.classList.add("hidden");
    console.log("All viewers hidden.");
}