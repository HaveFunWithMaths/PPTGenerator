"""
JSON to PPT Web Application
Flask backend for generating PowerPoint presentations from JSON data.
"""

import os
import json
import tempfile
import uuid
from flask import Flask, render_template, request, send_file, jsonify

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Import utilities from existing generate_ppt module
from generate_ppt import (
    SlideBuilder, SlideColors, SlideLayout, FontSettings,
    clean_chemistry_text, parse_meta_info, get_original_question_number,
    COLORS, LAYOUT, FONTS
)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size


@app.route('/')
def index():
    """Serve the main application page."""
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate_ppt():
    """
    Generate PowerPoint from uploaded JSON file.
    
    Expected JSON format:
    [
        {"q": "Question text...", "meta": "Year | Marks"},
        ...
    ]
    """
    try:
        # Check if file was uploaded
        if 'jsonFile' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['jsonFile']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.endswith('.json'):
            return jsonify({'error': 'Please upload a JSON file'}), 400
        
        # Parse JSON content
        try:
            content = file.read().decode('utf-8')
            questions_data = json.loads(content)
        except json.JSONDecodeError as e:
            return jsonify({'error': f'Invalid JSON format: {str(e)}'}), 400
        except UnicodeDecodeError:
            return jsonify({'error': 'File encoding error. Please use UTF-8 encoded JSON.'}), 400
        
        # Validate JSON structure
        if not isinstance(questions_data, list):
            return jsonify({'error': 'JSON must be an array of question objects'}), 400
        
        if len(questions_data) == 0:
            return jsonify({'error': 'JSON array is empty'}), 400
        
        for i, item in enumerate(questions_data):
            if not isinstance(item, dict):
                return jsonify({'error': f'Item {i+1} is not a valid object'}), 400
            if 'q' not in item:
                return jsonify({'error': f'Item {i+1} is missing required "q" field'}), 400
        
        # Generate PowerPoint
        prs = Presentation()
        builder = SlideBuilder(prs)
        
        for question in questions_data:
            # Ensure meta exists with default
            if 'meta' not in question:
                question['meta'] = ''
            builder.create_slide(question)
        
        # Save to temporary file
        temp_dir = tempfile.gettempdir()
        filename = f"presentation_{uuid.uuid4().hex[:8]}.pptx"
        filepath = os.path.join(temp_dir, filename)
        prs.save(filepath)
        
        # Return the file
        return send_file(
            filepath,
            mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation',
            as_attachment=True,
            download_name='Generated_Presentation.pptx'
        )
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


if __name__ == '__main__':
    print("\n[*] JSON to PPT Generator")
    print("=" * 40)
    print("Open http://localhost:5000 in your browser")
    print("=" * 40 + "\n")
    app.run(debug=True, port=5000)
