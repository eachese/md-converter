# Markdown Converter

A simple yet powerful web application to convert your Markdown files into DOCX and PDF formats seamlessly. Built with modern web technologies, it's designed to be fast, reliable, and easy to use.

## Live Demo

[You can access the deployed application here.]() <!-- TODO: Add your Vercel deployment URL here -->

## Features

-   **Markdown to DOCX & PDF:** Convert `.md` files to both `.docx` and `.pdf` formats in a single operation.
-   **Drag & Drop Interface:** Easily upload your files using a modern drag-and-drop zone.
-   **Serverless Ready:** Architected for modern serverless platforms like Vercel, ensuring scalability and cost-efficiency.
-   **No File Storage:** Files are converted in-memory and sent directly to your browser, ensuring privacy and eliminating the need for server-side file management.
-   **Responsive Design:** A clean and fully responsive user interface that works on all devices.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/)
-   **UI Library:** [React](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **PDF Generation:** [Puppeteer](https://pptr.dev/) (using `@sparticuz/chromium-min` for serverless environments)
-   **DOCX Generation:** [html-to-docx](https://www.npmjs.com/package/html-to-docx)
-   **Markdown Parsing:** [Remark](https://remark.js.org/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en) (v20 or later) and a package manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd md-converter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

The project is configured to use the full `puppeteer` package for local development to ensure it works smoothly on Windows and macOS. For production builds, it automatically switches to the lightweight `@sparticuz/chromium-min` package.

## Deployment

The easiest way to deploy this Next.js application is to use the [Vercel Platform](https://vercel.com/new).

The project is pre-configured for a zero-config deployment to Vercel.

1.  **Push your code** to a Git repository (GitHub, GitLab, Bitbucket).
2.  **Import your project** into Vercel.
3.  **Deploy!**

Vercel will automatically detect the Next.js framework and configure the build settings. No environment variables are required for the deployment.
