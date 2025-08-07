# Vue.js Experiment Tracker

A modern, responsive experiment tracking application built with Vue 3 and PrimeVue for visualizing machine learning experiment data.

🚀 **[Live Demo](https://oleh-khotymchuk.github.io/Experiment-tracker/)** | 📊 **[Sample Data](public/sample-data.csv)**

## Features

### Core Functionality

- **CSV File Upload**: Upload experiment data from your machine
- **Experiment Management**: View and select experiments for visualization
- **Interactive Charts**: Line and scatter plots showing metric progression over training steps
- **Multi-Experiment Comparison**: Compare multiple experiments side-by-side
- **Real-time Filtering**: Search and filter experiments by name or metric
- **Chart Interactions**: Zoom, pan, and reset functionality with mouse and touch support

### UX & Scalability Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between light and dark modes with system preference detection
- **Loading States**: Visual feedback during file processing with progress indicators
- **Error Handling**: Comprehensive error messages and validation
- **Data Export**: Export selected experiment data as CSV
- **Efficient Rendering**: Optimized chart rendering for large datasets (1M+ data points)
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Debounced updates and smart sampling for smooth interactions

## CSV Data Format

Your CSV file should contain the following columns:

- `experiment_id`: String identifying a particular training run (e.g., "exp_001")
- `metric_name`: Name of the tracked metric (e.g., "accuracy", "loss", "f1_score")
- `step`: Training step number (e.g., 1, 2, 3...)
- `value`: Metric value at that step (e.g., 0.85, 0.23)

### Sample Data

```csv
experiment_id,metric_name,step,value
exp_001,accuracy,1,0.75
exp_001,accuracy,2,0.82
exp_001,loss,1,0.65
exp_001,loss,2,0.45
```

A sample CSV file is available at `public/sample-data.csv` for testing.

## Technology Stack

- **Vue 3**: Progressive JavaScript framework with Composition API
- **PrimeVue**: Rich UI component library with comprehensive theming
- **Chart.js**: Flexible charting library for data visualization
- **chartjs-plugin-zoom**: Advanced zoom and pan functionality
- **Papa Parse**: Fast CSV parser with streaming support
- **Vue Router**: Client-side routing
- **Vite**: Next-generation frontend build tool

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/oleh-khotymchuk/Experiment-tracker.git
cd Experiment-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Upload Data**: Click "Choose CSV File" and select your experiment data
2. **Select Experiments**: Use checkboxes to select experiments for visualization
3. **Filter & Search**: Use the search bar and metric filter to find specific experiments
4. **Visualize**: View interactive line/scatter charts for each metric
5. **Compare**: Select multiple experiments to compare their performance
6. **Interact**: Zoom with mouse wheel, pan with Ctrl+drag, double-click to reset
7. **Export**: Download selected experiment data as CSV
8. **Theme**: Toggle between light and dark modes

## Deployment

### GitHub Pages (Automatic)

This repository is configured for automatic deployment to GitHub Pages via GitHub Actions:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy the application
3. Your app will be available at `https://oleh-khotymchuk.github.io/Experiment-tracker/`

### Manual Deployment

```bash
# Build the application
npm run build

# The built files will be in the 'dist' directory
# Deploy the contents of 'dist' to your hosting provider
```

## Application Architecture

### Components Structure

```
src/
├── App.vue                    # Root component with router
├── main.js                    # Application entry point
├── style.css                  # Global styles and theme variables
└── components/
    └── ExperimentTracker.vue  # Main tracking interface
```

### Key Features Implementation

- **File Processing**: Uses Papa Parse for efficient CSV parsing with validation and error handling
- **State Management**: Vue 3 Composition API with reactive references and computed properties
- **Chart Rendering**: Chart.js integration with dynamic dataset generation and zoom/pan capabilities
- **Theme System**: CSS custom properties for seamless theme switching with system preference detection
- **Responsive Layout**: CSS Grid and Flexbox for adaptive layouts across all device sizes
- **Performance Optimization**: Data sampling for large datasets and debounced chart updates
- **Error Boundaries**: Comprehensive error handling with user-friendly messages

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance

- **Large Dataset Support**: Efficiently handles files with 1M+ data points
- **Smart Sampling**: Automatically samples large datasets for optimal chart performance
- **Memory Management**: Proper cleanup of chart instances and event listeners
- **Responsive Loading**: Progressive loading with visual feedback

## Screenshots

### Light Theme

![Light Theme Dashboard](docs/screenshots/light-theme.png)

### Dark Theme

![Dark Theme Dashboard](docs/screenshots/dark-theme.png)

### Mobile View

![Mobile Responsive](docs/screenshots/mobile-view.png)

## Inspired By

This application draws inspiration from leading ML experiment tracking platforms:

- [MLflow](https://mlflow.org/classical-ml/experiment-tracking)
- [Weights & Biases](https://docs.wandb.ai/guides/track/)
- [Comet](https://www.comet.com/docs/v2/guides/experiment-management/quickstart/)
- [Neptune](https://neptune.ai/)

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes with appropriate tests
4. **Commit** your changes (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### Development Guidelines

- Use Vue 3 Composition API
- Follow PrimeVue component patterns
- Write meaningful commit messages
- Test on multiple browsers and devices
- Update documentation for new features

## Issues & Support

- 🐛 **Bug Reports**: [Create an issue](https://github.com/oleh-khotymchuk/Experiment-tracker/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/oleh-khotymchuk/Experiment-tracker/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Vue.js](https://vuejs.org/) and [PrimeVue](https://primevue.org/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- CSV parsing by [Papa Parse](https://www.papaparse.com/)
- Deployed on [GitHub Pages](https://pages.github.com/)

---

⭐ **If this project helped you, please give it a star!** ⭐
