// Call when you want to trigger file picker from web page
function triggerFilePicker() {
    if (window.AndroidInterface && AndroidInterface.openFilePicker) {
        AndroidInterface.openFilePicker();
    } else {
        console.warn("Android interface not available");
    }
}
    