/*
            // Modal Handling
            const overlay = document.getElementById('modal-overlay');
            const uploadBtn = document.getElementById('open-upload-btn');
            const createBtn = document.getElementById('open-create-btn');
            const uploadModal = document.getElementById('upload-modal');
            const createModal = document.getElementById('create-modal');
            const closeBtns = document.querySelectorAll('.modal-close');
            const dropArea = document.querySelector('.drag-drop-area');
            const fileInput = document.getElementById('file-input');
            
            // New elements for user search
            const searchUserBtn = document.getElementById('search-user-btn');
            const userIdInput = document.getElementById('user-id-input');
            const userDetailsContainer = document.getElementById('user-details-container');
            
            // New elements for recipient list
            const recipientList = document.getElementById('recipient-list');
            const recipientPlaceholder = document.getElementById('recipient-placeholder');
            const recipientListTitle = document.getElementById('recipient-list-title');
            
            let recipients = []; // Array to store recipient objects

            const openModal = (modal) => {
                if (modal == null) return;
                overlay.classList.add('active');
                modal.classList.add('active');
            };

            const closeModal = (modal) => {
                if (modal == null) return;
                overlay.classList.remove('active');
                modal.classList.remove('active');

                // Reset upload modal on close
                if (modal.id === 'upload-modal') {
                    userIdInput.value = '';
                    recipientList.innerHTML = ''; // Clear list
                    recipients = []; // Clear array
                    recipientPlaceholder.style.display = 'block'; // Show placeholder
                    recipientListTitle.style.display = 'none'; // Hide title
                    dropArea.style.display = 'none';
                    const p = dropArea.querySelector('p');
                    p.innerHTML = `Drag & drop files here or <strong>click to select</strong>`;
                    fileInput.value = '';
                }
            };

            if (uploadBtn) {
                uploadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(uploadModal);
                });
            }

            if (createBtn) { // Added this handler
                createBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(createModal);
                });
            }

            closeBtns.forEach(button => { // Added this handler
                button.addEventListener('click', () => {
                    const modal = button.closest('.modal');
                    closeModal(modal);
                });
            });

            overlay.addEventListener('click', () => { // Added this handler
                const modals = document.querySelectorAll('.modal.active');
                modals.forEach(modal => {
                    closeModal(modal);
                });
            });

            // User Search Handling
            if (searchUserBtn) {
                searchUserBtn.addEventListener('click', async () => {
                    const userId = userIdInput.value.trim();
                    if (!userId) {
                        alert('Please enter a User ID.'); // Use simple alert for admin panel
                        return;
                    }
                    
                    if (recipients.find(r => r.id === userId)) {
                        alert('User already added to the list.');
                        userIdInput.value = ''; // Clear input
                        return;
                    }
                    
                    recipientPlaceholder.textContent = 'Fetching user details...';
                    recipientPlaceholder.style.display = 'block';

                    try {
                        // ... MOCK API CALL ...
                        const fetchUserFromServer = async (userId) => {
                            const response = await fetch(`/add_auth_user/${encodeURIComponent(userId)}`);
                            if (!response.ok) {
                                // You can parse error JSON too if you want
                                throw new Error("User not found.");
                            }
                            const user = await response.json(); // { name, publicKey }
                            return user;
                        };

                        // usage:
                        const user = await fetchUserFromServer(userId);
                        console.log(user.name, user.publicKey);
                        
                        // --- END MOCK ---
                        
                        // Add to recipients array
                        const recipientData = { id: userId, name: user.name, publicKey: user.publicKey };
                        
                        
                        recipients.push(recipientData);
                        
                        // Add recipient tag to UI
                        addRecipientTag(recipientData);
                        
                        userIdInput.value = ''; // Clear input for next search
                        recipientPlaceholder.style.display = 'none'; // Hide placeholder
                        recipientListTitle.style.display = 'block'; // Show "Recipients:" title
                        dropArea.style.display = 'block'; // Show drop area

                    } catch (error) {
                        recipientPlaceholder.textContent = error.message;
                        recipientPlaceholder.style.color = 'red';
                    }
                });
            }
            
            function addRecipientTag(recipient) {
                const tag = document.createElement('div');
                tag.className = 'recipient-tag';
                tag.dataset.id = recipient.id;
                tag.innerHTML = `
                    <span><strong>${recipient.name}</strong> (${recipient.id})</span>
                    <span class="remove-recipient" title="Remove">&times;</span>
                `;
                
                tag.querySelector('.remove-recipient').addEventListener('click', () => {
                    // Remove from array
                    recipients = recipients.filter(r => r.id !== recipient.id);
                    // Remove from UI
                    tag.remove();
                    
                    // Check if list is empty
                    if (recipients.length === 0) {
                        recipientPlaceholder.style.display = 'block';
                        recipientPlaceholder.textContent = 'Enter a User ID to fetch details.';
                        recipientPlaceholder.style.color = '#aaa';
                        recipientListTitle.style.display = 'none';
                        dropArea.style.display = 'none';
                    }
                });
                
                recipientList.appendChild(tag);
            }

            // Drag and Drop Handling
            if (dropArea) {
                // Add click listener to trigger file input
                dropArea.addEventListener('click', () => {
                    fileInput.click();
                });

                fileInput.addEventListener('change', (e) => {
                    handleFiles(e.target.files);
                });

                // Prevent default drag behaviors
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, preventDefaults, false);
                    document.body.addEventListener(eventName, preventDefaults, false); // Prevent browser from opening file
                });

                function preventDefaults(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                // Highlight drop area when item is dragged over it
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropArea.addEventListener(eventName, highlight, false);
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, unhighlight, false);
                });

                function highlight(e) {
                    dropArea.classList.add('drag-over');
                }

                function unhighlight(e) {
                    dropArea.classList.remove('drag-over');
                }

                // Handle dropped files
                dropArea.addEventListener('drop', handleDrop, false);

                function handleDrop(e) {
                    let dt = e.dataTransfer;
                    let files = dt.files;

                    handleFiles(files);
                }

                function handleFiles(files) {
                    files = [...files];
                    if (files.length > 0) {
                        const p = dropArea.querySelector('p');
                        p.innerHTML = `<strong>File selected:</strong> ${files[0].name}`;

                        const formData = new FormData();
                        formData.append('file', files[0]);   // "file" is the field name Flask will use

                        fetch('/upload', {                   // adjust URL if needed
                            method: 'POST',
                            body: formData                   // DO NOT set Content-Type manually
                        })
                        .then(res => res.json())
                        .then(data => {
                            console.log('Upload OK:', data);    
                        })
                        .catch(err => {
                            console.error('Upload error:', err);
                        });

                        // Optional: keep your modal-close logic
                        setTimeout(() => {
                            closeModal(uploadModal);
                            setTimeout(() => {
                                p.innerHTML = `Drag & drop files here or <strong>click to select</strong>`;
                                fileInput.value = '';
                            }, 300);
                        }, 2000);
                    }
                }

            }
        ;

*/



// Modal Handling
const overlay = document.getElementById('modal-overlay');
const uploadBtn = document.getElementById('open-upload-btn');
const createBtn = document.getElementById('open-create-btn');
const uploadModal = document.getElementById('upload-modal');
const createModal = document.getElementById('create-modal');
const closeBtns = document.querySelectorAll('.modal-close');
const dropArea = document.querySelector('.drag-drop-area');
const fileInput = document.getElementById('file-input');

// New elements for user search
const searchUserBtn = document.getElementById('search-user-btn');
const userIdInput = document.getElementById('user-id-input');
const userDetailsContainer = document.getElementById('user-details-container');

// New elements for recipient list
const recipientList = document.getElementById('recipient-list');
const recipientPlaceholder = document.getElementById('recipient-placeholder');
const recipientListTitle = document.getElementById('recipient-list-title');

// Issue Button Elements
const issueBtnContainer = document.querySelector('.issue-btn-container');
const issueBtn = document.getElementById('issue-btn');

let recipients = []; // Array to store recipient objects
let storedFile = null; // Variable to hold the file object until issue
let isFileSelected = false; // Track if a file has been dropped/selected

// Helper to check if Issue Button should be visible
function checkIssueButtonState() {
    if (recipients.length > 0 && isFileSelected) {
        issueBtnContainer.style.display = 'block';
    } else {
        issueBtnContainer.style.display = 'none';
    }
}

const openModal = (modal) => {
    if (modal == null) return;
    overlay.classList.add('active');
    modal.classList.add('active');
};

const closeModal = (modal) => {
    if (modal == null) return;
    overlay.classList.remove('active');
    modal.classList.remove('active');

    // Reset upload modal on close
    if (modal.id === 'upload-modal') {
        userIdInput.value = '';
        recipientList.innerHTML = ''; // Clear list
        recipients = []; // Clear array
        storedFile = null; // Clear stored file
        isFileSelected = false; // Reset file flag
        
        recipientPlaceholder.style.display = 'block'; // Show placeholder
        recipientListTitle.style.display = 'none'; // Hide title
        dropArea.style.display = 'none'; // Hide drop area
        issueBtnContainer.style.display = 'none'; // Hide issue button
        
        // Reset Issue button state if it was loading
        if(issueBtn) {
            issueBtn.style.display = 'inline-block';
            issueBtn.textContent = "Issue Document to Recipients";
            issueBtn.disabled = false;
        }
        if(issueBtnContainer) {
            // Remove any success message if present
            const msg = issueBtnContainer.querySelector('p');
            if(msg) msg.remove();
        }
        
        const p = dropArea.querySelector('p');
        p.innerHTML = `Drag & drop files here or <strong>click to select</strong>`;
        fileInput.value = '';
    }
};

if (uploadBtn) {
    uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(uploadModal);
    });
}

if (createBtn) { 
    createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(createModal);
    });
}

closeBtns.forEach(button => { 
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

overlay.addEventListener('click', () => { 
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        closeModal(modal);
    });
});

// User Search Handling
if (searchUserBtn) {
    searchUserBtn.addEventListener('click', async () => {
        const userId = userIdInput.value.trim();
        if (!userId) {
            alert('Please enter a User ID.'); 
            return;
        }
        
        if (recipients.find(r => r.id === userId)) {
            alert('User already added to the list.');
            userIdInput.value = ''; 
            return;
        }
        
        recipientPlaceholder.textContent = 'Fetching user details...';
        recipientPlaceholder.style.display = 'block';

        try {
            // ... MOCK API CALL ...
            const fetchUserFromServer = async (userId) => {
                // Mimicking server response
                const response = await fetch(`/add_auth_user/${encodeURIComponent(userId)}`);
                if (!response.ok) {
                    throw new Error("User not found.");
                }
                const user = await response.json(); 
                return user;
            };

            // usage:
            const user = await fetchUserFromServer(userId);
            
            // Add to recipients array
            const recipientData = { id: userId, name: user.name, publicKey: user.publicKey };
            
            recipients.push(recipientData);
            
            // Add recipient tag to UI
            addRecipientTag(recipientData);
            
            userIdInput.value = ''; // Clear input for next search
            recipientPlaceholder.style.display = 'none'; // Hide placeholder
            recipientListTitle.style.display = 'block'; // Show "Recipients:" title
            dropArea.style.display = 'block'; // Show drop area
            
            checkIssueButtonState(); // Check if we can show issue button

        } catch (error) {
            recipientPlaceholder.textContent = error.message;
            recipientPlaceholder.style.color = 'red';
        }
    });
}

function addRecipientTag(recipient) {
    const tag = document.createElement('div');
    tag.className = 'recipient-tag';
    tag.dataset.id = recipient.id;
    tag.innerHTML = `
        <span><strong>${recipient.name}</strong> (${recipient.id})</span>
        <span class="remove-recipient" title="Remove">&times;</span>
    `;
    
    tag.querySelector('.remove-recipient').addEventListener('click', function() {
        // Remove from array
        recipients = recipients.filter(r => r.id !== recipient.id);
        // Remove from UI
        tag.remove();
        
        // Check if list is empty
        if (recipients.length === 0) {
            recipientPlaceholder.style.display = 'block';
            recipientPlaceholder.textContent = 'Enter a User ID to fetch details.';
            recipientPlaceholder.style.color = '#aaa';
            recipientListTitle.style.display = 'none';
            dropArea.style.display = 'none';
        }
        
        checkIssueButtonState(); // Update button state
    });
    
    recipientList.appendChild(tag);
}

// New Function: Triggers success UI (Ticks and Auto-close)
function triggerSuccessTick(username) {
  // Find all recipient tags
  document.querySelectorAll('.recipient-tag').forEach(tag => {
    const tagUsername = tag.dataset.username; // assumes <div class="recipient-tag" data-username="alice">
    
    if (tagUsername === username) {
      const span = tag.querySelector('.remove-recipient');
      if (span) {
        span.textContent = '✔'; // Checkmark
        span.classList.remove('remove-recipient');
        span.classList.add('success-tick');
        span.title = 'Issued';
      }
    }
  });
}





    // 2. Hide the issue button and show success message
    if (issueBtn) issueBtn.style.display = 'none';
    
    if (issueBtnContainer) {
        // Append message cleanly to avoid breaking event listeners on siblings
        const successMsg = document.createElement('p');
        successMsg.style.color = '#00ff00';
        successMsg.style.fontSize = '2vh';
        successMsg.style.marginTop = '1vh';
        successMsg.textContent = 'Document Issued Successfully!';
        issueBtnContainer.appendChild(successMsg);
    }

    // 3. Close Modal after delay
    setTimeout(() => {
        // Reset button for next time (handled in closeModal)
        closeModal(uploadModal);
    }, 1500);


// Issue Button Logic
if (issueBtn) {
    issueBtn.addEventListener('click', () => {
        if (!storedFile) {
            alert("No file selected.");
            return;
        }
        if (recipients.length === 0) {
            alert("No recipients selected.");
            return;
        }

        // Change button state to indicate processing
        const originalText = issueBtn.textContent;
        issueBtn.textContent = "Issuing...";
        issueBtn.disabled = true;

        // Create FormData to send file and recipients
        const formData = new FormData();
        formData.append('file', storedFile); // Append the stored file
        formData.append('recipients', JSON.stringify(recipients)); // Append recipients as JSON

        // Perform the upload/issue request
        fetch('/upload', { 
            method: 'POST',
            body: formData 
        })
        .then(res => res.json())
        .then(data => {
            console.log('Issue OK:', data);
            
            // Trigger the success logic now that server responded
            
        })
        .catch(err => {
            console.error('Issue error:', err);
            alert("Failed to issue document. See console for details.");
            // Reset button
            issueBtn.textContent = originalText;
            issueBtn.disabled = false;
        });
    });
}


// Drag and Drop Handling
if (dropArea) {
    // Add click listener to trigger file input
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false); 
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropArea.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropArea.classList.remove('drag-over');
    }

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        handleFiles(files);
    }

    function handleFiles(files) {
        files = [...files];
        if (files.length > 0) {
            storedFile = files[0]; // Store the file for later usage
            
            const p = dropArea.querySelector('p');
            p.innerHTML = `<strong>File selected:</strong> ${storedFile.name}`;

            // Mark file as selected (not uploaded yet) and check button visibility
            isFileSelected = true;
            checkIssueButtonState();
        }
    }
}