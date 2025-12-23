# JSON to PPT Generator 🎨

A web application that converts JSON question data into beautifully formatted PowerPoint presentations. Includes step-by-step instructions for generating JSON from PDFs using Google Gemini AI.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- **Modern Web Interface** - Dark theme with glassmorphism design
- **Drag & Drop Upload** - Easy JSON file upload
- **PDF to JSON Guide** - Detailed instructions using Google Gemini AI
- **LaTeX Support** - Handles subscripts, superscripts, fractions, Greek letters, and arrows
- **Instant Download** - Generate and download PPT in seconds

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HaveFunWithMaths/PPTGenerator.git
   cd PPTGenerator
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 📖 How to Use

### Step 1: Generate JSON from PDF
1. Go to [Google Gemini](https://gemini.google.com)
2. Attach your PDF containing questions
3. Use the prompt provided on the website
4. Save the response as a `.json` file

### Step 2: Generate PowerPoint
1. Upload your JSON file via drag-and-drop
2. Click "Generate PowerPoint"
3. Download your presentation

## 📄 JSON Format

```json
[
  {
    "q": "1. What is the SI unit of electric current?",
    "meta": "2024 | 1 Mark"
  },
  {
    "q": "2. Calculate the resistance using $R = \\frac{V}{I}$",
    "meta": "2023 | 2 Marks"
  }
]
```

### Supported LaTeX Formatting
| Format | Syntax | Output |
|--------|--------|--------|
| Subscript | `H_{2}O` | H₂O |
| Superscript | `x^{2}` | x² |
| Fraction | `\frac{a}{b}` | (a/b) |
| Greek | `\Delta`, `\Omega` | Δ, Ω |
| Arrows | `\rightarrow` | → |

## 📁 Project Structure

```
PPTGenerator/
├── app.py                 # Flask backend
├── generate_ppt.py        # PPT generation logic
├── questions_data.py      # Sample data
├── requirements.txt       # Dependencies
├── templates/
│   └── index.html         # Main page
└── static/
    ├── styles.css         # Styling
    └── script.js          # Client-side logic
```

## 🛠️ Tech Stack

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **PPT Generation**: python-pptx

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with ❤️ by [HaveFunWithMaths](https://github.com/HaveFunWithMaths)
