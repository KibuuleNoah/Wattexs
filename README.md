````markdown
# Wattexs (WhatsApp Text Status)

A web application that allows users to create custom whatsapp text status on backgrounds and download them as images.

![Screenshot of the application](screenshot.png) _(Note: Add your own screenshot image)_

## Features

- 🖼️ **Background Options**:

  - Choose from the pre-defined beautiful preset background images
  - Text Solid color for text color styling
  - Text overlay for better readability on images

- ✏️ **Text Customization**:

  - Multiple font styles and sizes
  - Custom text color selection
  - Four text alignment options (left, center, right, justify)
  - Multi-line text support

- 💾 **Export Functionality**:
  - Download your creation as a 1000×640 PNG image
  - Real-time preview of your design

## How to Use

1. **Enter your text** in the text area
2. **Customize your text**:
   - Select font style and size
   - Choose text color
   - Set text alignment
3. **Select a background**:
   - Choose from the grid of background images
4. **Toggle text overlay** if you need better readability on busy backgrounds
5. **Click "Update Canvas" or "Enter key"** to see your changes
6. **Download your image** when you're satisfied with the result

## Technical Details

- **Frontend**:
  - HTML5 Canvas for image generation
  - Jquery & Vanilla JavaScript for all functionality
  - Tailwindcss, daisyUi and custom CSS for styling, layouts and elements

## Setup

### Requirements

- Python 3.8 or higher
- pip (Python package installer)
- Virtualenv (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Wattexs.git
cd Wattexs
```
````

### 2. Create and Activate a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory and add your environment variables:

### 6. Run the Application

```bash
python main.py
```

## Accessing the Application

Open your web browser and navigate to `http://127.0.0.1:5000/` to see the application running.

## Customization

To add your own background images:

1. Replace the URLs in the `backgroundOptions` array in the JavaScript code
2. Make sure your images are ideally 1000×640 pixels for best results

```javascript
const backgroundOptions = [
  "path/to/your/image1.jpg",
  "path/to/your/image2.jpg",
  // Add more images as needed
];
```

## Browser Support

The application works on all modern browsers including:

- Chrome
- Firefox
- Safari
- Edge

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## Contact

If you have any questions or feedback, feel free to reach out at [your-email@example.com].---

**Created by** Tristar Moxie  
**GitHub**: [your-github-profile](https://github.com/your-profile)  
**Live Demo**: [Demo Link](#) _(Add your live demo link if available)_
