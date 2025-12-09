// =======================
// FORM ELEMENTS
// =======================
const nameInput = document.getElementById('name');
const idInput = document.getElementById('user_id');
const passwordInput = document.getElementById('password');
const submitButton = document.querySelector('button[type="submit"]');
const form = document.querySelector('form');

// =======================
// INITIAL BUTTON STATE
// =======================
submitButton.disabled = true;
submitButton.style.opacity = '0.5';
submitButton.style.cursor = 'not-allowed';
submitButton.style.pointerEvents = 'none';

// =======================
// ALERT CONTAINER SETUP
// =======================
const alertContainer = document.createElement('div');
alertContainer.id = 'security-alert-container';
alertContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 280px;
    max-height: 60vh;
    overflow-y: auto;
    z-index: 10000;
    pointer-events: none;
`;
document.body.appendChild(alertContainer);

// =======================
// CSS ANIMATIONS
// =======================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    #security-alert-container::-webkit-scrollbar {
        width: 6px;
    }
    #security-alert-container::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
    }
`;
document.head.appendChild(style);

// =======================
// VALIDATION RULES
// =======================
const validationRules = {
    name: {
        notEmpty: { test: (v) => v.trim().length > 0, message: 'Name cannot be empty' },
        maxLength: { test: (v) => v.trim().length <= 50, message: 'Name must be ≤ 50 characters' }
    },
    user_id: {
        notEmpty: { test: (v) => v.trim().length > 0, message: 'ID cannot be empty' },
        lengthNine: { test: (v) => v.trim().length === 9, message: 'ID must be exactly 9 characters' },
        alphanumeric: { test: (v) => /^[a-zA-Z0-9]+$/.test(v), message: 'ID must be alphanumeric' }
    },
    password: {
        minLength: { test: (v) => v.length >= 8, message: 'At least 8 characters' },
        hasUpperCase: { test: (v) => /[A-Z]/.test(v), message: 'One uppercase letter' },
        hasLowerCase: { test: (v) => /[a-z]/.test(v), message: 'One lowercase letter' },
        hasNumber: { test: (v) => /[0-9]/.test(v), message: 'At least one number' },
        hasSpecialChar: { test: (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v), message: 'One special character' }
    }
};

// =======================
// VALIDATION HELPERS
// =======================
function validateField(field, rules) {
    const results = {};
    let allPassed = true;
    for (const [key, rule] of Object.entries(rules)) {
        results[key] = rule.test(field);
        if (!results[key]) allPassed = false;
    }
    return { results, allPassed };
}

function createAlertTab(message) {
    const tab = document.createElement('div');
    tab.style.cssText = `
        background: #000;
        color: #fff;
        padding: 4px 10px;
        margin-bottom: 4px;
        border-radius: 4px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
        animation: slideIn 0.3s ease-out;
        border: 1.5px solid #ff0000;
        pointer-events: auto;
    `;
    const msg = document.createElement('span');
    msg.textContent = message;
    const icon = document.createElement('span');
    icon.textContent = '✗';
    icon.style.color = '#ff0000';
    icon.style.fontWeight = 'bold';
    tab.appendChild(msg);
    tab.appendChild(icon);
    return tab;
}

// =======================
// FIELD-SPECIFIC ALERTS
// =======================
function showAlertsForField(fieldId) {
    alertContainer.innerHTML = '';

    const value = document.getElementById(fieldId).value;
    const rules = validationRules[fieldId];
    if (!rules) return;

    const check = validateField(value, rules);
    const failed = [];

    for (const [key, passed] of Object.entries(check.results)) {
        if (!passed) failed.push(rules[key].message);
    }

    if (failed.length > 0) {
        const header = document.createElement('div');
        header.style.cssText = `
            background: #000;
            color: #fff;
            padding: 10px 12px;
            margin-bottom: 6px;
            border-radius: 4px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 600;
            border: 1.5px solid #ff0000;
            text-align: center;
        `;
        header.textContent = `${failed.length} Requirement${failed.length > 1 ? 's' : ''} Not Met`;
        alertContainer.appendChild(header);

        failed.forEach(msg => alertContainer.appendChild(createAlertTab(msg)));
    }
    updateSubmitState();
}

function updateSubmitState() {
    const nameCheck = validateField(nameInput.value, validationRules.name).allPassed;
    const idCheck = validateField(idInput.value, validationRules.user_id).allPassed;
    const passCheck = validateField(passwordInput.value, validationRules.password).allPassed;

    const allPassed = nameCheck && idCheck && passCheck;

    if (allPassed) {
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        submitButton.style.pointerEvents = 'auto';
    } else {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.5';
        submitButton.style.cursor = 'not-allowed';
        submitButton.style.pointerEvents = 'none';
    }
}

// =======================
// EVENT LISTENERS
// =======================
[nameInput, idInput, passwordInput].forEach(input => {
    input.addEventListener('focus', () => showAlertsForField(input.id));
    input.addEventListener('input', () => {
        clearTimeout(input._typingTimer);
        input._typingTimer = setTimeout(() => showAlertsForField(input.id), 300);
    });
    input.addEventListener('blur', () => {
        alertContainer.innerHTML = '';
        updateSubmitState();
    });
});

// =======================
// FORM SUBMIT BLOCKER
// =======================
form.addEventListener('submit', (e) => {
    const nameCheck = validateField(nameInput.value, validationRules.name).allPassed;
    const idCheck = validateField(idInput.value, validationRules.user_id).allPassed;
    const passCheck = validateField(passwordInput.value, validationRules.password).allPassed;

    if (!(nameCheck && idCheck && passCheck)) {
        e.preventDefault();
        const blockOverlay = document.createElement('div');
        blockOverlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            color: #fff;
            padding: 30px 40px;
            border-radius: 4px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.4);
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            animation: slideIn 0.3s ease-out;
            border: 2px solid #ff0000;
        `;
        blockOverlay.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 16px; color: #ff0000;">✗</div>
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">Requirements Not Met</div>
            <div style="font-size: 14px; opacity: 0.9;">Please complete all form requirements</div>
            <button style="margin-top: 20px; padding: 10px 24px; background: #fff; color: #000; border: 2px solid #000; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 14px;">OK</button>
        `;
        const okButton = blockOverlay.querySelector('button');
        okButton.addEventListener('click', () => blockOverlay.remove());
        document.body.appendChild(blockOverlay);
    }
});

async function fget() {
    fetch('/get-string')
  .then(response => response.text())
  .then(text => { 
    AndroidInterface.saveTextFile(text);  // Calls native Android method
  })
};  
