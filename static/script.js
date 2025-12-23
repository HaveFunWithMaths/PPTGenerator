/**
 * JSON to PPT Generator - Client Script (Static Version)
 * Handles file upload and local PPTX generation using PptxGenJS
 */

// Mapping for character replacements (porting from python)
const SUBSCRIPT_MAP = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '(': '₍', ')': '₎', '+': '₊', '-': '₋', '=': '₌', 'x': 'ₓ', 'y': 'y', 'z': 'z', 'n': 'ₙ'
};
const SUPERSCRIPT_MAP = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '(': '⁽', ')': '⁾', '+': '⁺', '-': '⁻', '=': '⁼', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ', 'n': 'ⁿ'
};

const LATEX_REPLACEMENTS = {
    '\\rightarrow': '→', '\\longrightarrow': '→', '\\leftarrow': '←', '\\leftrightarrow': '↔',
    '\\Delta': 'Δ', '\\underline{\\Delta}': 'Δ', '\\Omega': 'Ω', '\\omega': 'ω', '\\rho': 'ρ',
    '\\pi': 'π', '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\lambda': 'λ', '\\mu': 'μ',
    '\\sigma': 'σ', '\\theta': 'θ', '\\phi': 'φ', '\\epsilon': 'ε', '\\eta': 'η', '\\tau': 'τ',
    '\\times': '×', '\\div': '÷', '\\pm': '±', '\\mp': '∓', '\\cdot': '·', '\\geq': '≥',
    '\\leq': '≤', '\\neq': '≠', '\\approx': '≈', '\\equiv': '≡', '\\propto': '∝',
    '\\infty': '∞', '\\sqrt': '√', '\\degree': '°', '\\circ': '°'
};

function translateString(str, map) {
    return str.split('').map(char => map[char] || char).join('');
}

function cleanChemistryText(text) {
    if (!text) return "";

    // Convert fractions: \frac{a}{b} -> (a/b)
    text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1/$2)");

    // LaTeX symbol replacements
    for (const [latex, unicodeChar] of Object.entries(LATEX_REPLACEMENTS)) {
        text = text.split(latex).join(unicodeChar);
    }

    // Remove $ delimiters
    text = text.split('$').join('');

    // Convert superscripts: ^{...} and ^2 patterns
    text = text.replace(/\^\{([^}]+)\}/g, (_, p1) => translateString(p1, SUPERSCRIPT_MAP));
    text = text.replace(/\^([0-9xyn])/g, (_, p1) => translateString(p1, SUPERSCRIPT_MAP));

    // Convert subscripts: _{...} and _2 patterns
    text = text.replace(/_\{([^}]+)\}/g, (_, p1) => translateString(p1, SUBSCRIPT_MAP));
    text = text.replace(/_([0-9xyn])/g, (_, p1) => translateString(p1, SUBSCRIPT_MAP));

    // Clean up remaining backslashes
    text = text.replace(/\\([a-zA-Z]+)/g, "$1");

    return text.trim();
}

function getOriginalQuestionNumber(qText) {
    const match = qText.match(/^(SQ)?\d+\.?\s*(?:\([ivx]+\))?/);
    return match ? match[0].trim() : "?";
}

function parseMetaInfo(meta) {
    if (!meta) return ["", ""];
    const parts = meta.split('|');
    const year = parts[0] ? parts[0].trim() : "";
    const marks = parts[1] ? parts[1].trim() : "";
    return [year, marks];
}

document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('jsonFile');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-btn');
    const uploadForm = document.getElementById('upload-form');
    const message = document.getElementById('message');

    uploadZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
    });

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
        if (files.length > 0) handleFile(files[0]);
    });

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

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        if (!file) {
            showMessage('Please select a file first', 'error');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.classList.add('loading');
        generateBtn.querySelector('.btn-text').textContent = 'Generating...';
        generateBtn.querySelector('.btn-loader').style.display = 'inline-block';
        hideMessage();

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    await generatePptLocally(jsonData);
                    showMessage('✓ PowerPoint generated successfully!', 'success');
                } catch (err) {
                    showMessage('Error parsing JSON: ' + err.message, 'error');
                } finally {
                    resetBtnState();
                }
            };
            reader.readAsText(file);
        } catch (error) {
            showMessage('Error reading file: ' + error.message, 'error');
            resetBtnState();
        }
    });

    function resetBtnState() {
        generateBtn.disabled = false;
        generateBtn.classList.remove('loading');
        generateBtn.querySelector('.btn-text').textContent = 'Generate PowerPoint';
        generateBtn.querySelector('.btn-loader').style.display = 'none';
    }

    async function generatePptLocally(data) {
        if (!Array.isArray(data)) throw new Error('JSON must be an array of questions');

        let pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE'; // Using widescreen for modern look

        data.forEach(item => {
            let slide = pptx.addSlide();

            // Set Background
            slide.background = { color: '000000' };

            const qText = item.q || "";
            const meta = item.meta || "";
            const [year, marks] = parseMetaInfo(meta);
            const originalNum = getOriginalQuestionNumber(qText);
            const cleanedText = cleanChemistryText(qText);

            // Add Year label (top-left)
            slide.addText(year, {
                x: 0.5, y: 0.3, w: 4, h: 0.4,
                fontSize: 16, color: '00D4FF', bold: true, fontFace: 'Calibri'
            });

            // Add Marks label (top-right)
            slide.addText(marks, {
                x: 8.5, y: 0.3, w: 4, h: 0.4,
                fontSize: 16, color: 'FFB347', bold: true, fontFace: 'Calibri', align: 'right'
            });

            // Add Accent Line (rectangle)
            slide.addShape(pptx.ShapeType.rect, {
                x: 0.5, y: 0.85, w: 12.3, h: 0.03,
                fill: { color: '3C3C50' }
            });

            // Add Question Text
            slide.addText(cleanedText, {
                x: 0.5, y: 1.1, w: 12.3, h: 5.5,
                fontSize: 18, color: 'FFFFFF', fontFace: 'Calibri',
                valign: 'top', breakLine: true, wrap: true
            });

            // Add Question Badge (bottom-left)
            slide.addText(`Q${originalNum}`, {
                x: 0.5, y: 6.8, w: 2, h: 0.4,
                fontSize: 12, color: '646464', bold: true, fontFace: 'Calibri'
            });
        });

        await pptx.writeFile({ fileName: 'Generated_Presentation.pptx' });
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type}`;
        message.style.display = 'flex';
    }

    function hideMessage() {
        message.style.display = 'none';
    }
});

// Initialize copy button event listener
document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPrompt);
    }
});

function copyPrompt() {
    const promptElement = document.getElementById('gemini-prompt');
    const btn = document.querySelector('.copy-btn');

    if (!promptElement) {
        console.error('Prompt element not found');
        return;
    }

    const promptText = promptElement.innerText || promptElement.textContent;

    // Try modern clipboard API first (requires HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(promptText)
            .then(() => showCopySuccess(btn))
            .catch((err) => {
                console.log('Clipboard API failed, using fallback:', err);
                fallbackCopy(promptText, btn);
            });
    } else {
        // Fallback for HTTP or older browsers
        fallbackCopy(promptText, btn);
    }
}

function fallbackCopy(text, btn) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Make it invisible but still functional
    textarea.setAttribute('readonly', '');
    textarea.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';

    document.body.appendChild(textarea);

    // Select the text
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length); // For mobile devices

    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('execCommand error:', err);
    }

    document.body.removeChild(textarea);

    if (success) {
        showCopySuccess(btn);
    } else {
        showCopyError(btn);
    }
}

function showCopySuccess(btn) {
    btn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
        btn.innerHTML = '<span class="copy-icon">📋</span> Copy';
        btn.classList.remove('copied');
    }, 2000);
}

function showCopyError(btn) {
    btn.innerHTML = '<span class="copy-icon">❌</span> Failed';
    setTimeout(() => {
        btn.innerHTML = '<span class="copy-icon">📋</span> Copy';
    }, 2000);
}

function removeFile() {
    document.getElementById('jsonFile').value = '';
    document.getElementById('upload-zone').style.display = 'block';
    document.getElementById('file-info').style.display = 'none';
    document.getElementById('generate-btn').disabled = true;
    document.getElementById('message').style.display = 'none';
}
