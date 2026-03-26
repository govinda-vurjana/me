# Quick Start Guide

## 🎬 Adding Your Videos

1. **Place your video files** in the `data/` folder:
   - `data/film1.mp4`
   - `data/film2.mp4`
   - (Optional) `data/film1-thumbnail.jpg`
   - (Optional) `data/film2-thumbnail.jpg`

2. **Edit `data/films.json`** with your video details:
   ```json
   [
     {
       "title": "My Amazing Ad Campaign",
       "description": "A creative advertisement showcasing...",
       "videoUrl": "data/film1.mp4",
       "thumbnail": "data/film1-thumbnail.jpg",
       "tools": "Adobe Premiere Pro, After Effects, DaVinci Resolve",
       "technologies": "Color Grading, Motion Graphics, Sound Design",
       "date": "2025-01",
       "duration": "2:30",
       "category": "Advertisement"
     }
   ]
   ```

## 🌐 View Your Portfolio Locally

### Method 1: Double-click the batch file
Just double-click `start-server.bat` and it will:
- Start a local web server
- Open at http://localhost:8000

### Method 2: Manual command
Open Command Prompt in this folder and run:
```cmd
python -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

### Method 3: Direct open (may have issues with videos)
Just double-click `index.html` to open in browser

## 📝 Editing Your Content

- **Films**: Edit `data/films.json`
- **Portfolio Projects**: Edit `data/portfolio.json`
- **Blog Posts**: Edit `data/blogs.json`
- **Personal Info**: Edit the intro section in `index.html`

## 🎨 Video File Tips

- **Format**: MP4 (H.264) works best for web
- **Size**: Keep under 50MB for fast loading
- **Resolution**: 1920x1080 (Full HD) recommended
- **Thumbnails**: Use JPG or PNG, same aspect ratio as video (16:9)

## 🚀 Deploy to Web

Once you're happy with your portfolio:

1. **GitHub Pages**: Push to GitHub and enable Pages
2. **Netlify**: Drag and drop this folder
3. **Vercel**: Connect your repository

## 📧 Waitlist Email Setup

To receive email notifications when users join your waitlist:
- Follow the guide in `EMAIL_SETUP_GUIDE.md`
- Takes 5 minutes with EmailJS (free)

## 🎯 Navigation

Your portfolio now has these sections:
- **HOME**: Introduction + AI Tools showcase
- **BLOG**: Your Medium articles
- **PORTFOLIO**: AI/Tech projects
- **FILMS/SCRIPTS**: Your filmmaking work ← NEW!
- **WORK WITH ME**: Services and contact

---

Need help? Check the README.md or open an issue!
