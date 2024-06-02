const { ipcRenderer } = require('electron');
const XLSX = require('xlsx');

let jsonData = null; // Store JSON data after conversion

document.getElementById('excelFileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // Assuming we only have one sheet
    const sheet = workbook.Sheets[sheetName];
    jsonData = XLSX.utils.sheet_to_json(sheet);

    // Show convert button after loading the file
    document.getElementById('convertButton').style.display = 'inline-block';
  };
  reader.readAsArrayBuffer(file);

  // Hide upload button
  document.getElementById('uploadButton').style.display = 'none';
});

document.getElementById('convertButton').addEventListener('click', () => {
  if (!jsonData) {
    console.error('No Excel file selected.');
    return;
  }

  // Show conversion animation
  const convertButton = document.getElementById('convertButton');
  convertButton.innerText = 'Converting...';
  convertButton.disabled = true; // Disable the button during conversion

  const animationFrames = ['Converting', 'Converting.', 'Converting..', 'Converting...'];
  let frameIndex = 0;

  const animationInterval = setInterval(() => {
    convertButton.innerText = animationFrames[frameIndex];
    frameIndex = (frameIndex + 1) % animationFrames.length;
  }, 500); // Change the interval time to adjust the speed of animation

  // Simulate conversion time (you can remove this setTimeout in a real implementation)
  setTimeout(() => {
    clearInterval(animationInterval); // Stop the animation
    convertButton.innerText = 'Download JSON';
    convertButton.disabled = false; // Re-enable the button
    convertButton.id = 'downloadButton'; // Change button id to match download button id
    convertButton.removeEventListener('click', convertButtonClickHandler); // Remove old event listener
    convertButton.addEventListener('click', downloadButtonClickHandler); // Add new event listener
  }, 2000); // Change 2000 to the actual conversion time in milliseconds
});

function downloadButtonClickHandler() {
  if (!jsonData) {
    console.error('No JSON data available.');
    return;
  }

  ipcRenderer.send('saveJsonFile', jsonData);
}