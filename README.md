# JSON to PPT Generator 🎨

A **fully static web application** that converts JSON question data into beautifully formatted PowerPoint presentations – now running entirely in your browser!

## ✨ New in Version 2.0 (Static Deployment)
- **No Backend Needed**: All processing happens locally on your computer.
- **Fast & Private**: Your data never leaves your device.
- **GitHub Pages Ready**: Optimized for static hosting.

## 🚀 Live Demo
Deploy it to your own GitHub Pages in minutes!

## 📖 How to Use

### Step 1: Generate JSON from PDF
1. Go to [Google Gemini](https://gemini.google.com)
2. Attach your PDF containing questions
3. Use the prompt provided on the website
4. Save the response as a `.json` file

### Step 2: Generate PowerPoint
1. Go to the website.
2. Upload your JSON file via drag-and-drop.
3. Click "Generate PowerPoint".
4. The presentation will be created instantly in your browser.

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

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **PPT Generation**: [PptxGenJS](https://gitbrent.github.io/PptxGenJS/)

## 🚀 GitHub Pages Deployment

To host this yourself:
1. Go to your repository settings on GitHub.
2. Navigate to **Pages** in the left sidebar.
3. Under **Build and deployment**, set Source to "Deploy from a branch".
4. Select `main` branch and `/ (root)` folder.
5. Click **Save**.

Your site will be live at `https://HaveFunWithMaths.github.io/PPTGenerator/`

## 📝 License
MIT License. Created by [HaveFunWithMaths](https://github.com/HaveFunWithMaths)
