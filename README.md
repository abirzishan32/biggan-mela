# BigGan Mela - Educational Science Platform

<div align="center">

**An interactive educational platform combining AI, physics simulations, and engaging learning experiences**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1.1-green)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow)](https://www.python.org/)

</div>

## 🌟 Overview

BigGan Mela is a comprehensive educational platform that brings science learning to life through interactive simulations, AI-powered tools, and engaging content. The platform is designed to make complex scientific concepts accessible and fun for learners of all ages.

## ✨ Key Features

### 1. 🧪 Interactive 3D Virtual Simulations of Physics Experiments

Hands-on virtual laboratory with 20+ physics and chemistry experiments:

- **Physics Simulations:**
  - Simple Pendulum - Explore periodic motion and oscillations
  - Projectile Motion - Understand trajectory and kinematics
  - Double-Slit Experiment - Visualize wave-particle duality
  - Diffusion - Observe molecular movement
  - Conservation of Momentum - Interactive collision demonstrations
  - Lenz's Law - Electromagnetic induction visualization
  - Snell's Law - Light refraction experiments
  - Prism Dispersion - Light spectrum exploration
  - Lens Optics - Ray diagrams and focal points
  - Spring and Mass System - Simple harmonic motion
  - Electric Circuits - Build and test circuits

- **Chemistry Simulations:**
  - pH Scale - Acid-base chemistry visualization
  - And more interactive chemistry experiments

### 2. 🎯 Hands-on Explanation and Simulation of Algorithms

Interactive algorithm visualizations to understand complex computer science concepts:

- **Sorting Algorithms:**
  - Bubble Sort
  - Merge Sort
  - Quick Sort

- **Graph Algorithms:**
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra's Algorithm

Each algorithm includes step-by-step animations, complexity analysis, and real-time code execution visualization.

### 3. 📚 Interactive Stories for Children Learning Science

Engaging animated stories that make science concepts fun and memorable:

- **Water Cycle** - Journey through evaporation, condensation, and precipitation
- **States of Matter** - Explore solids, liquids, and gases
- **Fire Extinguisher** - Learn about fire safety and chemical reactions

Interactive storytelling with animations, narration, and comprehension quizzes.

### 4. 🤖 Doubt Solving Using Image Analysis and AI

AI-powered doubt resolution system with multi-modal capabilities:

- Upload images of problems or questions
- Bengali OCR support for local language learning
- Image-to-text extraction using advanced OCR
- AI-powered explanation generation
- Real-time chat interface for follow-up questions
- Support for PDF and image formats

### 5. 🦜 Identifying Endangered Species Through Image and Audio Analysis

Wildlife conservation tool using cutting-edge AI:

- **Bird Species Identification:**
  - Audio analysis using BirdNET for bird call recognition
  - Image recognition for bird species identification
  - Scientific name and confidence scores
  - Location-based species filtering
  - Database of 6,000+ bird species

- **Conservation Features:**
  - Endangered species alerts
  - Species information and habitat details
  - Contribution to citizen science projects

### 6. ✅ Agentic Fact-Checking Chatbot for Scientific Accuracy

Real-time fact verification powered by AI:

- Multi-source fact verification using Tavily API
- Evidence-based responses with citations
- Support for text, image, and PDF inputs
- Real-time streaming responses via WebSocket
- Scientific claim verification
- Source credibility analysis

### 7. 📰 News Portal Sharing World's Recent Scientific Advances

Curated science news aggregator:

- Latest breakthroughs in science and technology
- AI-powered news summarization
- Category filtering (Physics, Chemistry, Biology, Technology, Space)
- Regular updates from trusted sources
- Saved articles and reading lists

## 🏗️ Project Structure

```
biggan-mela/
├── frontend/                 # Next.js 15 frontend application
│   ├── app/
│   │   ├── (root)/          # Main application routes
│   │   │   ├── virtual-lab/ # Physics simulations
│   │   │   ├── storytelling/# Interactive stories
│   │   │   ├── fact-check/  # Fact-checking interface
│   │   │   ├── science-news/# News portal
│   │   │   ├── quiz/        # Quiz system
│   │   │   └── chat/        # AI chat interface
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (admin)/         # Admin dashboard
│   │   └── api/             # API routes
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility libraries
│   └── public/              # Static assets
│
├── backend/                 # Flask backend with ML services
│   ├── src/
│   │   ├── app.py          # Main Flask application
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   │   ├── file_processor.py
│   │   │   ├── pdf_processor.py
│   │   │   └── image_processor.py
│   │   ├── models/         # ML models
│   │   └── utils/          # Helper functions
│   └── requirements.txt    # Python dependencies
│
└── agents/                  # Standalone agent services
    ├── birdnet.py          # Bird sound analysis
    ├── birdphoto.py        # Bird image recognition
    ├── banglaocr.py        # Bengali OCR
    ├── factcheck.py        # Fact-checking agent
    └── pollution.py        # Environmental monitoring
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.8+
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abirzishan32/biggan-mela.git
   cd biggan-mela
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Agent Services Setup:**
   ```bash
   cd agents
   pip install -r requirements.txt
   ```

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
GOOGLE_API_KEY=your_google_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

**Backend `.env`:**
```env
TAVILY_API_KEY=your_tavily_api_key
GOOGLE_API_KEY=your_google_api_key
FLASK_ENV=development
```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend/src
   python app.py
   ```
   Backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.3.2 with React 19
- **UI Components:** Radix UI, Tailwind CSS
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **Animation:** Framer Motion
- **Physics Simulations:** p5.js, PixiJS
- **Charts:** Chart.js, React-Chartjs-2
- **Real-time Communication:** Socket.IO Client
- **AI Integration:** LangChain, Google Generative AI

### Backend
- **Framework:** Flask 3.1.1
- **API Documentation:** Flask-RESTX (Swagger)
- **Real-time:** Flask-SocketIO
- **ML/AI Libraries:**
  - BirdNET (Bird sound recognition)
  - Tesseract OCR (Text extraction)
  - TensorFlow/Keras (Deep learning)
  - Hugging Face Transformers (NLP)
  - LangChain (AI agent orchestration)
- **Document Processing:** PyPDF2, Pillow

### Database & Storage
- **Database:** PostgreSQL (via Prisma)
- **ORM:** Prisma
- **Authentication:** Supabase Auth
- **File Storage:** Local filesystem + Supabase Storage

## 📡 API Documentation

The backend provides a comprehensive REST API with Swagger documentation.

### Access Swagger UI
Visit `http://localhost:5000/swagger` when the backend is running.

### Key Endpoints

#### Bird Analysis
- `POST /api/analyze-bird` - Analyze bird sounds from audio files
- `POST /api/analyze-bird-photo` - Identify bird species from images

#### OCR & Text Processing
- `POST /api/ocr` - Extract Bengali text from images

#### Fact-Checking
- `POST /api/factcheck` - Verify scientific claims
- `POST /api/factcheck-files` - Fact-check with file uploads

#### Real-time Features
- WebSocket connection for streaming responses
- Socket.IO events for real-time updates

## 🎨 Features in Detail

### Virtual Laboratory
- Real-time physics simulations using advanced algorithms
- Adjustable parameters and variables
- Data visualization and graphing
- Educational explanations and formulas

### Algorithm Visualizations
- Step-by-step execution
- Time and space complexity display
- Interactive input controls
- Code highlighting and explanation

### AI Chat Assistant
- Context-aware responses
- Multi-turn conversations
- Image and document understanding
- Bengali language support

### Quiz System
- Multiple choice and interactive quizzes
- AI-generated questions
- Progress tracking
- SMS-based quiz delivery (Twilio integration)

### Career Guidance
- AI-powered career recommendations
- Personalized learning paths
- Skill assessment tools

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **BirdNET** - For bird sound recognition technology
- **Google Generative AI** - For AI-powered features
- **Hugging Face** - For pre-trained ML models
- **Tesseract OCR** - For text extraction capabilities
- **Three.js Community** - For 3D visualization tools
- **Next.js Team** - For the amazing React framework

## 📧 Contact & Support

- **Project Maintainer:** [abirzishan32](https://github.com/abirzishan32)
- **Issues:** [GitHub Issues](https://github.com/abirzishan32/biggan-mela/issues)

## 🗺️ Roadmap

- [ ] Mobile application (React Native)
- [ ] More physics experiments
- [ ] Expanded language support
- [ ] Virtual reality simulations
- [ ] Teacher dashboard and classroom management
- [ ] Offline mode support
- [ ] Advanced analytics and progress tracking

---

<div align="center">

**Made with ❤️ for science education**

⭐ Star this repository if you find it helpful!

</div>
