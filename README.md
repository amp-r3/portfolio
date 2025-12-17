# Portfolio | Amir Ergashev

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?logo=redux)

A modern, responsive portfolio website built to showcase my skills and projects as a Junior Web Developer. The application features a clean architecture, dynamic themes, internationalization, and smooth animations.

🔗 **Live Demo:** [https://amp3re.netlify.app/](https://amp3re.netlify.app/)

## 🚀 Tech Stack

This project leverages the latest ecosystem standards:

* **Core:** [React 19](https://react.dev/), [TypeScript 5.9+](https://www.typescriptlang.org/), [Vite 7](https://vitejs.dev/)
* **State Management:** React Context API (Theme & Language state)
* **Routing:** [React Router v7](https://reactrouter.com/)
* **Styling:** SCSS Modules with a design-token-based architecture
* **Internationalization:** [i18next](https://www.i18next.com/) (English, Russian & Uzbek support)
* **UI & Animations:**
    * [Motion](https://motion.dev/) (Framer Motion) for component transitions
    * [Locomotive Scroll](https://github.com/locomotivemtl/locomotive-scroll) for smooth scrolling experiences
    * [React Fast Marquee](https://www.npmjs.com/package/react-fast-marquee)

## ✨ Key Features

* **Responsive Design:** Fully optimized for mobile, tablet, and desktop devices.
* **Theme System:** Persistent Dark/Light mode toggle (saved in `localStorage` and respects system preferences).
* **Multi-language:** Dynamic language switching without page reload.
* **Clean Architecture:** Strict separation of concerns — UI components handle rendering, while custom hooks and Redux slices manage business logic.

## 📂 Featured Projects

The portfolio includes detailed case studies of my key projects:

### 1. Weather Forecast App
A dynamic weather application that automatically detects user location.
* **Tech:** OpenWeatherMap API, Geoapify, Redux Thunk.
* **Features:**
    * Real-time geolocation detection with IP fallback.
    * Client-side caching (`localStorage`) to minimize API calls.
    * Hourly and 7-day forecast data.

### 2. E-commerce Storefront
A modern storefront simulation with advanced catalog capabilities.
* **Tech:** DummyJSON API, Custom Hooks, React Router.
* **Features:**
    * **Server-Side Logic Simulation:** Pagination, sorting, and searching are handled via API parameters.
    * **URL Synchronization:** The catalog state (page, sort order) is synced with the URL, allowing sharable links.
    * **Shopping Cart:** Fully functional cart state management.

## 🛠️ Installation & Setup

1.  **Clone the repository:**
```bash
    git clone [https://github.com/amp-r3/portfolio.git](https://github.com/amp-r3/portfolio.git)
    cd portfolio
  ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    # or
    pnpm dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    # or
    pnpm build
    ```

## 📬 Contact

I am open to job opportunities and collaboration!

* **Location:** Uzbekistan
* **Portfolio:** [amp3re.netlify.app](https://amp3re.netlify.app/)
* **GitHub:** [https://github.com/amp-r3](https://github.com/)
* **LinkedIn:** [https://www.linkedin.com/in/amir-ergashev-96718a396](https://linkedin.com/)

---
© 2025 Amir Ergashev. All rights reserved.