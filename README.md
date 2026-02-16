# ISL Translator - Unified Platform

This project integrates ISL Translation, JASigning Avatar, and HamNoSys Builder into a single full-stack application.

## Features
- **Translate**: Convert text to Indian Sign Language (ISL) animations using a 3D avatar.
- **Builder**: Create custom gestures using the HamNoSys builder.
- **Library**: View and manage available signs.
- **Authentication**: User login and signup with history tracking.

## Prerequisites
- Node.js (v16+)
- NPM

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    cd server
    npm install
    cd ..
    ```

2.  **Start the Backend Server**
    ```bash
    node server/server.js
    ```
    The server runs on `http://localhost:5000`.

3.  **Start the Frontend**
    ```bash
    npm run dev
    ```
    The application runs on `http://localhost:5173`.

## Directory Structure
- `src/`: React frontend code.
- `server/`: Node.js backend code.
- `public/cwa/`: JASigning avatar assets.
- `public/builder_assets/`: HamNoSys builder assets.
- `server/data/`: SiGML data files.

## Usage
1.  Open the app in your browser.
2.  Login or Sign up.
3.  Use the **Translate** tab to convert text to sign language.
4.  Use the **Builder** tab to create new signs.
5.  Use the **Library** tab to browse signs.
