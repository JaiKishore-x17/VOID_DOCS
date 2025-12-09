document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const button = form.querySelector('button[type="submit"]');
    
    // Create message display area
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.style.display = 'none';
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            user_id: document.getElementById('user_id').value.trim(),
            password: document.getElementById('password').value
        };
        
        // Validation
        if (!formData.name || !formData.user_id || !formData.password) {
            showMessage('Please fill all fields', 'error');
            return;
        }
        
        // Show loading state
        button.textContent = 'Registering...';
        button.disabled = true;
        showMessage('', ''); // Clear previous messages
        
        try {
            const response = await fetch('/Register_Admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage(data.message || 'Registration successful!', 'success');
                
                // Download private key if provided
                if (data.private_key) {
                    if (confirm('✅ Registration successful!\n\nDownload your Private Key now?\n\n⚠️ KEEP THIS FILE SAFE - YOU NEED IT TO LOGIN!')) {
                        download(data.private_key);
                    }
                }
                
                // Auto-redirect after 3 seconds or manual redirect
                setTimeout(() => {
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    } else {
                        window.location.href = '/'; // Default home
                    }
                }, 3000);
                
            } else {
                showMessage(data.message || 'Registration failed', 'error');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Reset button
            button.textContent = 'Register';
            button.disabled = false;
        }
    });
    
    // Download function
    window.download = function(privateKeyText) {
        const blob = new Blob([privateKeyText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PrivateKey.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showMessage('✅ Private key downloaded! Keep it safe!', 'success');
    };
    
    // Message display helper
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        if (type === 'success') {
            messageDiv.style.background = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else {
            messageDiv.style.background = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        }
    }
});
