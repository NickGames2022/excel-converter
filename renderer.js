const { ipcRenderer } = require('electron');
const XLSX = require('xlsx');

let jsonData = null;

document.getElementById('excelFileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    jsonData = XLSX.utils.sheet_to_json(sheet);

    document.getElementById('convertButton').style.display = 'inline-block';
  };
  reader.readAsArrayBuffer(file);

  document.getElementById('uploadButton').style.display = 'none';
});

document.getElementById('convertButton').addEventListener('click', () => {
  if (!jsonData) {
    console.error('No Excel file selected.');
    return;
  }

  const convertButton = document.getElementById('convertButton');
  convertButton.innerText = 'Converting...';
  convertButton.disabled = true;

  const animationFrames = ['Converting', 'Converting.', 'Converting..', 'Converting...'];
  let frameIndex = 0;

  const animationInterval = setInterval(() => {
    convertButton.innerText = animationFrames[frameIndex];
    frameIndex = (frameIndex + 1) % animationFrames.length;
  }, 500);

  setTimeout(() => {
    clearInterval(animationInterval);
    convertButton.innerText = 'Download JSON';
    convertButton.disabled = false;
    convertButton.id = 'downloadButton';
    convertButton.removeEventListener('click', convertButtonClickHandler);
    convertButton.addEventListener('click', downloadButtonClickHandler);
  }, 2000);
});

function downloadButtonClickHandler() {
  if (!jsonData) {
    console.error('No JSON data available.');
    return;
  }

  ipcRenderer.send('saveJsonFile', jsonData);
}
