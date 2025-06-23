# DSA Search Engine

A comprehensive search engine for data structures and algorithms, built with React, TypeScript, and Tailwind CSS.

## 📋 Features

- **Search Engine**: Find algorithms and data structures by name, category, or complexity
- **Detailed Information**: Access comprehensive details on time/space complexity, implementation, and use cases
- **Examples**: View practical examples of algorithm implementation and usage
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Technologies Used

- **React 19**: The latest version of React with improved performance
- **TypeScript**: For static type checking
- **Tailwind CSS**: For utility-first styling
- **Vite**: For incredibly fast development and build
- **React Router**: For client-side routing
- **Google OAuth**: For authentication via Google

## 🛠️ Environment Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file by copying `.env.example`
4. Add your Google OAuth credentials to `.env.local` (see [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) for details)
5. Run the development server with `npm run dev`

**Note:** The `.env.local` file contains sensitive API keys and is ignored by Git. For deployment instructions to properly set up environment variables on hosting platforms, see [DEPLOYMENT_ENV_SETUP.md](./DEPLOYMENT_ENV_SETUP.md).

## 🏗️ Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Route components
├── services/         # API and service interactions
├── hooks/            # Custom React hooks
├── utils/            # Helper functions
└── types/            # TypeScript type definitions
```

## 🛠️ Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dsa-search-engine.git
   cd dsa-search-engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

   Or simply push to the main branch and GitHub Actions will deploy automatically.

## 📝 LeetCode Problem Updates

The website includes problems from LeetCode that are loaded from a static JSON file. This file is created by a Python scraper. There are multiple ways to update this data:

### Manual Updates
Run the scraper script manually when you want to update:
```bash
cd backend
python leetcode_scraper.py
```

### Automated Updates (Recommended)
The repository includes a GitHub Action that automatically updates the LeetCode problems once a month (on the 1st day at midnight UTC). This ensures users see up-to-date problems without manual intervention.

You can also trigger manual updates from the GitHub Actions tab in your repository.

### Update Schedule
- GitHub Action runs automatically on the 1st day of each month
- Problems are scraped from LeetCode API
- Changes are committed automatically if new problems are found
- Vercel deployment updates with the new data

This means the website will stay up to date without you needing to manually run the scraper.

## 📚 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## 🧠 Data Sources

Currently, the app uses mock data. In a production environment, this would be replaced with:
- A backend API serving algorithm data
- A database containing comprehensive algorithm information
- User-contributed examples and implementations

## 📝 Future Improvements

- Add authentication for user contributions
- Implement algorithm visualizations
- Add complexity comparisons between algorithms
- Create a community section for discussions
- Add a feature to save favorite algorithms

## 📄 License

MIT License

---

Made with ❤️ by DSA Search Engine Team
