# CareerMate - AI Resume Analyzer

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Project Overview

CareerMate is an AI-powered resume analyzer that helps job seekers optimize their resumes for specific job applications. Users can upload their resume (PDF format), provide job details, and receive intelligent feedback on how well their resume matches the job description. The app leverages AI to analyze resumes, provide ATS (Applicant Tracking System) scores, and offer personalized improvement tips.

Key functionalities include:
- Resume upload and processing
- Job-specific analysis
- AI-generated feedback and scoring
- Dashboard to track multiple applications
- Secure authentication and data storage

## Features

- 🚀 **AI-Powered Analysis**: Uses advanced AI to evaluate resumes against job descriptions
- 📄 **PDF Processing**: Converts and analyzes PDF resumes using PDF.js
- 🔐 **Secure Authentication**: Integrated with Puter for user authentication
- 💾 **Data Persistence**: Stores resumes and feedback using Puter's key-value storage
- 📊 **Visual Feedback**: Displays scores and suggestions with interactive components
- 🎨 **Modern UI**: Built with TailwindCSS for a responsive and attractive interface
- ⚡ **Fast Development**: Hot Module Replacement (HMR) for efficient development
- 🔒 **TypeScript**: Full type safety for robust code
- 📱 **Responsive Design**: Works seamlessly across devices

## Tech Stack

- **Frontend Framework**: React 19 with React Router 7 for client-side routing and server-side rendering
- **Language**: TypeScript for type-safe development
- **Styling**: TailwindCSS for utility-first CSS styling
- **State Management**: Zustand for lightweight and scalable state management
- **PDF Handling**: PDF.js for parsing and converting PDF files to images
- **Backend Services**: Puter for authentication, file storage, AI analysis, and key-value storage
- **Build Tool**: Vite for fast development and optimized production builds
- **Deployment**: Docker-ready for easy containerization and deployment

## What I Learned

Building CareerMate was an enriching experience that deepened my understanding of modern web development and AI integration:

- **AI Integration**: Learned how to integrate external AI services (Puter) for natural language processing and feedback generation, including handling API responses and error management.
- **File Handling**: Gained expertise in processing PDF files, converting them to images for AI analysis, and managing file uploads securely.
- **State Management**: Improved skills in using Zustand for global state management, especially for handling authentication and user data across components.
- **Full-Stack React**: Enhanced knowledge of React Router's full-stack capabilities, including server-side rendering and data loading patterns.
- **User Experience**: Focused on creating intuitive workflows for resume analysis, from upload to feedback display, emphasizing user-friendly interfaces.
- **Security and Privacy**: Implemented secure authentication and data handling practices, ensuring user resumes are processed and stored responsibly.
- **Performance Optimization**: Learned techniques for optimizing app performance, such as lazy loading and efficient data fetching.
- **Deployment and DevOps**: Gained experience in containerizing applications with Docker and preparing for production deployments.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AnkitBarmola/ai-resume-analyzer.git
cd ai-resume-analyzer
```

2. Install the dependencies:
```bash
npm install
```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```



Built with ❤️ using React Router and Puter.
