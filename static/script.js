/**
 * JSON to PPT Generator - Client Script
 * Handles file upload, form submission, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('jsonFile');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-btn');
    const uploadForm = document.getElementById('upload-form');
    const message = document.getElementById('message');

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
    });

    // Drag and drop handlers
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Handle file selection
    function handleFile(file) {
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            showMessage('Please upload a JSON file (.json)', 'error');
            return;
        }

        fileName.textContent = file.name;
        uploadZone.style.display = 'none';
        fileInfo.style.display = 'flex';
        generateBtn.disabled = false;
        hideMessage();
    }

    // Form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            showMessage('Please select a file first', 'error');
            return;
        }

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.classList.add('loading');
        generateBtn.querySelector('.btn-text').textContent = 'Generating...';
        generateBtn.querySelector('.btn-loader').style.display = 'inline-block';
        hideMessage();

        try {
            const formData = new FormData();
            formData.append('jsonFile', file);

            const response = await fetch('/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate PowerPoint');
            }

            // Download the file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Generated_Presentation.pptx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

            showMessage('✓ PowerPoint generated successfully!', 'success');

        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            // Reset button state
            generateBtn.disabled = false;
            generateBtn.classList.remove('loading');
            generateBtn.querySelector('.btn-text').textContent = 'Generate PowerPoint';
            generateBtn.querySelector('.btn-loader').style.display = 'none';
        }
    });

    // Show message
    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type}`;
        message.style.display = 'flex';
    }

    // Hide message
    function hideMessage() {
        message.style.display = 'none';
    }
});

// Copy prompt to clipboard
function copyPrompt() {
    const promptText = document.getElementById('gemini-prompt').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.innerHTML = '<span class="copy-icon">📋</span> Copy';
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const btn = document.querySelector('.copy-btn');
        btn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
            btn.innerHTML = '<span class="copy-icon">📋</span> Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// Remove selected file
function removeFile() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('jsonFile');
    const fileInfo = document.getElementById('file-info');
    const generateBtn = document.getElementById('generate-btn');
    const message = document.getElementById('message');

    fileInput.value = '';
    uploadZone.style.display = 'block';
    fileInfo.style.display = 'none';
    generateBtn.disabled = true;
    message.style.display = 'none';
}
