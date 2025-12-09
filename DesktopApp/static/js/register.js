
fetch('/get-string')
  .then(response => response.text())
  .then(text => {
    AndroidInterface.saveTextFile(text);  // Calls native Android method
  });
