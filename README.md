# Vue.js Experiment Tracker

A modern, responsive experiment tracking application built with Vue 3 and PrimeVue for visualizing machine learning experiment data.

## Features

### Core Functionality

- **CSV File Upload**: Upload experiment data from your machine
- **Experiment Management**: View and select experiments for visualization
- **Interactive Charts**: Line charts showing metric progression over training steps
- **Multi-Experiment Comparison**: Compare multiple experiments side-by-side
- **Real-time Filtering**: Search and filter experiments by name or metric

### UX & Scalability Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between light and dark modes
- **Loading States**: Visual feedback during file processing
- **Error Handling**: Comprehensive error messages and validation
- **Data Export**: Export selected experiment data as CSV
- **Efficient Rendering**: Optimized chart rendering for large datasets
- **Accessibility**: Full keyboard navigation and screen reader support

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
- **PrimeVue**: Rich UI component library
- **Chart.js**: Flexible charting library for data visualization
- **Papa Parse**: Fast CSV parser
- **Vue Router**: Client-side routing
- **Vite**: Next-generation frontend build tool

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
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
4. **Visualize**: View interactive line charts for each metric
5. **Compare**: Select multiple experiments to compare their performance
6. **Export**: Download selected experiment data as CSV

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

- **File Processing**: Uses Papa Parse for efficient CSV parsing with validation
- **State Management**: Vue 3 Composition API with reactive references
- **Chart Rendering**: Chart.js integration with dynamic dataset generation
- **Theme System**: CSS custom properties for seamless theme switching
- **Responsive Layout**: CSS Grid and Flexbox for adaptive layouts

## Inspired By

This application draws inspiration from leading ML experiment tracking platforms:

- [MLflow](https://mlflow.org/classical-ml/experiment-tracking)
- [Weights & Biases](https://docs.wandb.ai/guides/track/)
- [Comet](https://www.comet.com/docs/v2/guides/experiment-management/quickstart/)
- [Neptune](https://neptune.ai/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
