# Fitness AI - Personalized Workout & Diet Planner

A modern, AI-powered fitness application that provides personalized workout plans, diet recommendations, and progress tracking. Built with React, Vite, and TailwindCSS.

![Fitness AI](https://img.shields.io/badge/Fitness-AI-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC)

## 🌟 Features

- **Personalized Workout Plans**
  - AI-generated workout routines based on fitness goals
  - Customizable exercise intensity and duration
  - Detailed exercise instructions and sets/reps
  - Workout history tracking

- **Smart Diet Planning**
  - Customized meal plans based on goals and preferences
  - Detailed nutritional information
  - Macro and calorie tracking
  - Weekly meal planning

- **Progress Tracking**
  - Visual progress charts and metrics
  - Weight and measurement tracking
  - Goal achievement monitoring
  - Historical data analysis

- **User-Friendly Interface**
  - Modern, responsive design
  - Intuitive navigation
  - Dark mode optimized
  - Mobile-friendly layout

## 🚀 Live Demo

Visit the live application: [Fitness AI](https://trainwise-sigma.vercel.app/signin)

## 🛠️ Tech Stack

- **Frontend**
  - React 18.3.1
  - Vite 5.4.2
  - TailwindCSS 3.4.1
  - React Router DOM 6.22.3
  - Chart.js & React-Chartjs-2
  - Axios
  - Lucide React Icons

- **Development Tools**
  - TypeScript
  - ESLint
  - PostCSS
  - Autoprefixer

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Daksh154/Fitness-AI
   cd fitness-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=your_api_url_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🚀 Deployment

This project is configured for deployment on Vercel. Follow these steps:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project in Vercel:
   - Set the framework preset to Vite
   - Set the root directory to `.`
   - Add your environment variables
   - Deploy!

3. Vercel will automatically:
   - Install dependencies
   - Build the project
   - Deploy to production

## 📁 Project Structure

```
fitness-ai/
├── src/
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── config/         # Configuration files
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── vercel.json         # Vercel deployment config
└── package.json        # Project dependencies
```
