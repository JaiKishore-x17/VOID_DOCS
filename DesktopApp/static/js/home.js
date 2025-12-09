
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
                        const mockServerFetch = (id) => {
                            return new Promise((resolve, reject) => {
                                const mockDb = {
                                    "user123": { name: "Ravi K. Sharma", publicKey: "0x1aB...c3D" },
                                    "user456": { name: "Priya Singh", publicKey: "0x4eF...g5H" },
                                    "admin99": { name: "Admin User", publicKey: "0x9iJ...k7L" }
                                };
                                
                                setTimeout(() => { // Simulate network delay
                                    if (mockDb[id]) {
                                        resolve({ ok: true, json: () => mockDb[id] });
                                    } else {
                                        reject(new Error("User not found in database."));
                                    }
                                }, 1000);
                            });
                        };
                        
                        const response = await mockServerFetch(userId);
                        if (!response.ok) throw new Error("User not found.");
                        
                        const user = response.json();
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
                        
                        // Log files AND the recipient list
                        console.log(`File(s) dropped for ${recipients.length} recipient(s):`, files);
                        console.log('Recipients:', recipients);
                        
                        // Optional: close modal after 2s and reset text
                        setTimeout(() => {
                            closeModal(uploadModal);
                            // Reset text after modal is closed
                            setTimeout(() => {
                                p.innerHTML = `Drag & drop files here or <strong>click to select</strong>`;
                                fileInput.value = ''; // Clear the file input
                            }, 300); // 300ms matches CSS transition
                        }, 2000);
                    }
                }
            }
        ;