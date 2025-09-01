# Apple Collection Game - Replit Development Guide

## Overview

This is a 2D grid-based exploration game built with React, TypeScript, and Express.js. Players navigate through a randomly generated world to collect apples while managing limited energy resources. The game features a fog-of-war visibility system where players can only see a 3x3 area around their character, with previously explored areas displayed on a minimap. The application follows a full-stack architecture with a React frontend and Express backend, using PostgreSQL with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React with TypeScript and is built with Vite for fast development and optimized production builds. The UI is constructed with Radix UI components and styled using Tailwind CSS for a modern, responsive design. The application implements a custom game engine that handles:

- **Canvas-based Rendering**: HTML5 Canvas for real-time game graphics
- **State Management**: Custom React hooks for game state and Zustand for global state
- **Touch/Mouse Input**: Responsive controls supporting both desktop and mobile devices
- **Component Architecture**: Modular game components (GameCanvas, GameUI, MiniMap)

### Game Engine Design
The core game logic is separated into distinct modules:

- **GameEngine**: Handles player movement, collision detection, and game rules
- **WorldGenerator**: Creates procedurally generated game worlds with obstacles and collectibles
- **Input System**: Unified touch and keyboard input handling
- **Audio System**: Sound effect management with mute/unmute functionality

### Backend Architecture
The server uses Express.js with TypeScript in ESM module format. The backend is designed to be stateless and RESTful, though currently implements minimal API endpoints. The architecture supports:

- **Express Middleware**: Custom logging and error handling
- **Route Registration**: Modular route organization
- **Development Integration**: Vite middleware for hot module replacement
- **Static Serving**: Production-ready static file serving

### Data Storage Architecture
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The data layer includes:

- **Schema Definition**: Centralized database schema in `shared/schema.ts`
- **Migration System**: Drizzle-kit for database migrations
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations
- **Connection Management**: Neon Database serverless PostgreSQL integration

### Build and Development System
The project uses a modern development stack optimized for full-stack TypeScript development:

- **Vite**: Frontend build tool with React plugin and GLSL shader support
- **ESBuild**: Backend bundling for production deployment
- **TypeScript**: Strict type checking across client, server, and shared code
- **Path Aliases**: Simplified imports using `@/` and `@shared/` prefixes

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Comprehensive set of low-level UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs

### Development Tools
- **Vite**: Build tool with React plugin and development server
- **TypeScript**: Static type checking and modern JavaScript features
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **ESBuild**: Fast JavaScript bundler for production builds

### React Ecosystem
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zustand**: Lightweight state management for client-side state
- **React Three Fiber**: 3D graphics support (configured but not actively used)

### Session and State Management
- **Connect PG Simple**: PostgreSQL session store for Express sessions
- **Nanoid**: Secure URL-friendly unique ID generator
- **Date-fns**: Modern date utility library

The application is configured for deployment on Replit with environment-based database URL configuration and supports both development and production modes with appropriate optimizations for each environment.