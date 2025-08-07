<template>
	<div class="experiment-tracker">
		<!-- Header -->
		<div class="header">
			<div class="container">
				<div class="header-content">
					<h1 class="title">
						<i class="pi pi-chart-line"></i>
						Experiment Tracker
					</h1>
					<p class="subtitle">Upload and visualize your ML experiment data</p>
				</div>
				<div class="theme-toggle">
					<Button
						:icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
						@click="toggleTheme"
						text
						rounded
						severity="secondary"
						v-tooltip="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
					/>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="container main-content">
			<!-- File Upload Section -->
			<Card class="upload-card" v-if="!experiments.length">
				<template #header>
					<div class="upload-header">
						<i class="pi pi-cloud-upload upload-icon"></i>
						<h2>Upload Experiment Data</h2>
					</div>
				</template>
				<template #content>
					<div class="upload-area">
						<FileUpload
							ref="fileUpload"
							mode="basic"
							:custom-upload="true"
							@uploader="onFileUpload"
							accept=".csv"
							:max-file-size="100000000"
							:show-upload-button="false"
							:show-cancel-button="false"
							choose-label="Choose CSV File"
							class="upload-button"
							:loading="uploading"
						/>
						<div class="upload-info">
							<p>Upload a CSV file with the following columns:</p>
							<ul>
								<li>
									<strong>experiment_id:</strong> String identifying a training
									run
								</li>
								<li>
									<strong>metric_name:</strong> Name of the tracked metric
								</li>
								<li><strong>step:</strong> Training step number</li>
								<li><strong>value:</strong> Metric value at that step</li>
							</ul>
						</div>
					</div>
				</template>
			</Card>

			<!-- Dashboard -->
			<div v-if="experiments.length" class="dashboard">
				<!-- Dataset Statistics -->
				<Card class="stats-panel">
					<template #content>
						<div class="stats-grid">
							<div class="stat-item">
								<i class="pi pi-chart-line stat-icon"></i>
								<div class="stat-content">
									<div class="stat-value">{{ experiments.length }}</div>
									<div class="stat-label">Experiments</div>
								</div>
							</div>
							<div class="stat-item">
								<i class="pi pi-tag stat-icon"></i>
								<div class="stat-content">
									<div class="stat-value">{{ totalMetrics }}</div>
									<div class="stat-label">Unique Metrics</div>
								</div>
							</div>
							<div class="stat-item">
								<i class="pi pi-list stat-icon"></i>
								<div class="stat-content">
									<div class="stat-value">
										{{ totalDataPoints.toLocaleString() }}
									</div>
									<div class="stat-label">Data Points</div>
								</div>
							</div>
							<div class="stat-item">
								<i class="pi pi-chart-bar stat-icon"></i>
								<div class="stat-content">
									<div class="stat-value">{{ maxSteps }}</div>
									<div class="stat-label">Max Steps</div>
								</div>
							</div>
						</div>
					</template>
				</Card>

				<!-- Zoom Instructions -->
				<Card class="zoom-info-panel">
					<template #content>
						<div class="zoom-instructions">
							<div class="instruction-header">
								<i class="pi pi-info-circle"></i>
								<span>Chart Interaction Guide</span>
							</div>
							<div class="instruction-grid">
								<div class="instruction-item">
									<strong>Zoom:</strong> Mouse wheel or drag selection
								</div>
								<div class="instruction-item">
									<strong>Pan:</strong> Hold Ctrl + drag to move around
								</div>
								<div class="instruction-item">
									<strong>Reset:</strong> Double-click chart or use reset
									buttons
								</div>
								<div class="instruction-item">
									<strong>Mobile:</strong> Pinch to zoom, two-finger pan
								</div>
							</div>
						</div>
					</template>
				</Card>

				<!-- Control Panel -->
				<Card class="control-panel">
					<template #header>
						<div class="panel-header">
							<h3>Experiment Selection</h3>
							<div class="panel-actions">
								<Button
									label="Upload New File"
									icon="pi pi-upload"
									@click="resetData"
									severity="secondary"
									size="small"
								/>
								<Button
									label="Export Selection"
									icon="pi pi-download"
									@click="exportSelection"
									size="small"
									:disabled="!selectedExperiments.length"
								/>
							</div>
						</div>
					</template>
					<template #content>
						<div class="experiment-controls">
							<!-- Search and Filter -->
							<div class="search-filter">
								<span class="p-input-icon-left">
									<i class="pi pi-search"></i>
									<InputText
										v-model="searchQuery"
										placeholder="Search experiments..."
										class="search-input"
									/>
								</span>
								<Dropdown
									v-model="selectedMetricFilter"
									:options="metricOptions"
									option-label="label"
									option-value="value"
									placeholder="Filter by metric"
									show-clear
									class="metric-filter"
								/>
							</div>

							<!-- Experiment List -->
							<div class="experiment-list-section">
								<div class="list-header">
									<h4>Experiments ({{ filteredExperiments.length }})</h4>
									<div class="list-actions">
										<Button
											label="Select All"
											@click="selectAllExperiments"
											text
											size="small"
										/>
										<Button
											label="Clear All"
											@click="clearSelection"
											text
											size="small"
										/>
									</div>
								</div>
								<div class="experiment-list">
									<div
										v-for="experiment in filteredExperiments"
										:key="experiment.id"
										class="experiment-item"
										:class="{
											selected: selectedExperiments.includes(experiment.id),
										}"
										@click="toggleExperimentSelection(experiment.id)"
									>
										<Checkbox
											v-model="selectedExperiments"
											:input-id="experiment.id"
											:value="experiment.id"
											class="experiment-checkbox"
											@click.stop
										/>
										<div class="experiment-info">
											<label
												:for="experiment.id"
												class="experiment-name"
												@click="toggleExperimentSelection(experiment.id)"
											>
												{{ experiment.id }}
											</label>
											<div class="experiment-meta">
												<Tag
													v-for="metric in experiment.metrics"
													:key="metric"
													:value="metric"
													severity="info"
													class="metric-tag"
												/>
												<span class="step-count"
													>{{ experiment.stepCount }} steps</span
												>
												<span class="data-count"
													>{{
														experiment.dataPointCount ||
														getTotalDataPoints(experiment)
													}}
													points</span
												>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</template>
				</Card>

				<!-- Visualization Panel -->
				<Card v-if="selectedExperiments.length" class="visualization-panel">
					<template #header>
						<div class="panel-header">
							<h3>Experiment Visualization</h3>
							<div class="chart-controls">
								<SelectButton
									v-model="chartType"
									:options="chartTypeOptions"
									option-label="label"
									option-value="value"
									class="chart-type-selector"
									:allow-empty="false"
								/>
								<ToggleButton
									v-model="showLegend"
									on-label="Hide Legend"
									off-label="Show Legend"
									on-icon="pi pi-eye-slash"
									off-icon="pi pi-eye"
									class="legend-toggle"
								/>
								<div class="zoom-controls">
									<Button
										icon="pi pi-search-plus"
										@click="resetAllZoom"
										severity="secondary"
										size="small"
										v-tooltip="'Reset Zoom (Double-click charts)'"
										text
									/>
									<Button
										icon="pi pi-refresh"
										@click="resetAllZoom"
										severity="secondary"
										size="small"
										v-tooltip="'Reset All Charts'"
										text
									/>
								</div>
							</div>
						</div>
					</template>
					<template #content>
						<div class="charts-container">
							<div
								v-for="metric in selectedMetrics"
								:key="metric"
								class="chart-wrapper"
							>
								<div class="chart-header">
									<h4>{{ metric }}</h4>
									<div class="chart-meta">
										<Badge
											:value="`${
												getSelectedExperimentsForMetric(metric).length
											} experiments`"
											severity="info"
										/>
										<div class="individual-chart-controls">
											<Button
												icon="pi pi-search-plus"
												@click="resetChartZoom(metric)"
												severity="secondary"
												size="small"
												v-tooltip="'Reset Zoom'"
												text
											/>
											<Button
												icon="pi pi-arrows-alt"
												@click="fitChartToData(metric)"
												severity="secondary"
												size="small"
												v-tooltip="'Fit to Data'"
												text
											/>
										</div>
									</div>
								</div>
								<div class="chart-container">
									<canvas
										:key="`canvas-${metric}`"
										:ref="
											(el) => {
												if (el) {
													chartRefs[metric] = el;
												}
											}
										"
										class="chart-canvas"
									></canvas>
								</div>
							</div>
						</div>
					</template>
				</Card>

				<!-- No Selection State -->
				<Card v-else class="no-selection">
					<template #content>
						<div class="no-selection-content">
							<i class="pi pi-chart-line no-selection-icon"></i>
							<h3>Select experiments to visualize</h3>
							<p>
								Choose one or more experiments from the list above to see their
								metrics visualization.
							</p>
						</div>
					</template>
				</Card>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	computed,
	onMounted,
	onBeforeUnmount,
	nextTick,
	watch,
} from "vue";
import { useToast } from "primevue/usetoast";
import Papa from "papaparse";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	LineController,
	ScatterController,
	Title,
	Tooltip,
	Legend,
	TimeScale,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";

// PrimeVue Components
import Card from "primevue/card";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import Tag from "primevue/tag";
import Badge from "primevue/badge";
import SelectButton from "primevue/selectbutton";
import ToggleButton from "primevue/togglebutton";

// Add global error handling for zoom plugin
const originalConsoleError = console.error;

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	LineController,
	ScatterController,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	zoomPlugin
);

// Patch getBoundingClientRect to handle null/undefined canvas gracefully
const originalGetBoundingClientRect =
	HTMLCanvasElement.prototype.getBoundingClientRect;

// Store original getBoundingClientRect for potential null calls
const originalElementGetBoundingClientRect =
	Element.prototype.getBoundingClientRect;

// Patch both HTMLCanvasElement and Element getBoundingClientRect
HTMLCanvasElement.prototype.getBoundingClientRect = function () {
	try {
		// Check if canvas is still in DOM and valid
		if (!this || !this.parentNode || !document.contains(this)) {
			console.warn("getBoundingClientRect called on detached canvas");
			return {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
			};
		}
		return originalGetBoundingClientRect.call(this);
	} catch (error) {
		console.warn("getBoundingClientRect error caught:", error);
		return {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
		};
	}
};

// Global protection against null getBoundingClientRect calls
const safeGetBoundingClientRect = function () {
	try {
		if (!this) {
			console.warn("getBoundingClientRect called on null element");
			return {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
			};
		}
		return originalElementGetBoundingClientRect.call(this);
	} catch (error) {
		console.warn("getBoundingClientRect error caught:", error);
		return {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
		};
	}
};

// Patch all potential elements that might be accessed by zoom plugin
Element.prototype.getBoundingClientRect = safeGetBoundingClientRect;

// Also protect against direct calls to null.getBoundingClientRect
// by wrapping the zoom plugin's getPointPosition function
let originalGetPointPosition;
try {
	// Try to intercept zoom plugin calls more directly
	const script = document.createElement("script");
	script.textContent = `
		// Override potential null access
		const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
		window.safeGetBoundingClientRect = function() {
			try {
				if (!this) return { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0 };
				return originalGetBoundingClientRect.call(this);
			} catch (error) {
				return { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0 };
			}
		};
	`;
	document.head.appendChild(script);
} catch (e) {
	console.warn("Could not inject zoom plugin protection:", e);
}

// Global error handlers to catch zoom plugin errors that we can't prevent
window.addEventListener("error", (event) => {
	const error = event.error;
	const message = error?.message || "";

	// Catch zoom plugin getBoundingClientRect errors
	if (
		message.includes("getBoundingClientRect") ||
		message.includes("getPointPosition") ||
		message.includes("zoomStart") ||
		message.includes("wheelPreconditions") ||
		(event.filename && event.filename.includes("chartjs-plugin-zoom"))
	) {
		console.warn("[Zoom Plugin Error Caught]:", message);
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
});

// Handle unhandled promise rejections from zoom plugin
window.addEventListener("unhandledrejection", (event) => {
	const reason = event.reason;
	const message = reason?.message || reason?.toString() || "";

	if (
		message.includes("getBoundingClientRect") ||
		message.includes("chartjs") ||
		message.includes("zoom") ||
		message.includes("getPointPosition")
	) {
		console.warn("[Zoom Plugin Promise Rejection Caught]:", message);
		event.preventDefault();
		return false;
	}
});

// Override console.error to filter zoom plugin errors
console.error = function (...args) {
	// Filter out zoom plugin errors that we can't prevent
	const message = args[0]?.toString() || "";
	if (
		message.includes("ownerDocument") ||
		message.includes("fullSize") ||
		message.includes("getComputedStyle") ||
		message.includes("getBoundingClientRect") ||
		message.includes("Cannot set properties of undefined") ||
		message.includes("Cannot read properties of undefined") ||
		message.includes("Cannot read properties of null") ||
		message.includes("Cannot read property") ||
		message.includes("Cannot set property") ||
		(message.includes("chartjs") &&
			(message.includes("zoom") || message.includes("pan")))
	) {
		// Log warning instead of error for these known issues
		console.warn("[Chart.js/Zoom Plugin]", ...args);
		return;
	}
	// Pass through other errors normally
	originalConsoleError.apply(console, args);
};

// Reactive data
const toast = useToast();
const experiments = ref([]);
const selectedExperiments = ref([]);
const searchQuery = ref("");
const selectedMetricFilter = ref(null);
const uploading = ref(false);
const isDark = ref(false);
const chartType = ref("line");
const showLegend = ref(true);
const charts = ref({});
const chartRefs = ref({});
const isUpdatingCharts = ref(false);

// Computed properties
const metricOptions = computed(() => {
	const metrics = new Set();
	experiments.value.forEach((exp) => {
		exp.metrics.forEach((metric) => metrics.add(metric));
	});
	return Array.from(metrics).map((metric) => ({
		label: metric,
		value: metric,
	}));
});

const totalMetrics = computed(() => {
	const metrics = new Set();
	experiments.value.forEach((exp) => {
		exp.metrics.forEach((metric) => metrics.add(metric));
	});
	return metrics.size;
});

const totalDataPoints = computed(() => {
	return experiments.value.reduce((total, exp) => {
		return total + getTotalDataPoints(exp);
	}, 0);
});

const maxSteps = computed(() => {
	return Math.max(0, ...experiments.value.map((exp) => exp.stepCount));
});

const filteredExperiments = computed(() => {
	let filtered = experiments.value;

	// Filter by search query
	if (searchQuery.value) {
		filtered = filtered.filter((exp) =>
			exp.id.toLowerCase().includes(searchQuery.value.toLowerCase())
		);
	}

	// Filter by metric
	if (selectedMetricFilter.value) {
		filtered = filtered.filter((exp) => {
			const hasMetric = exp.metrics.includes(selectedMetricFilter.value);
			return hasMetric;
		});
	}

	return filtered;
});

const selectedMetrics = computed(() => {
	const metrics = new Set();
	selectedExperiments.value.forEach((expId) => {
		const experiment = experiments.value.find((exp) => exp.id === expId);
		if (experiment) {
			experiment.metrics.forEach((metric) => metrics.add(metric));
		}
	});
	return Array.from(metrics);
});

const chartTypeOptions = [
	{ label: "Line", value: "line" },
	{ label: "Scatter", value: "scatter" },
];

// Methods
const onFileUpload = async (event) => {
	uploading.value = true;
	const file = event.files[0];

	try {
		// Show progress for large files
		const fileSizeMB = file.size / (1024 * 1024);
		if (fileSizeMB > 10) {
			toast.add({
				severity: "info",
				summary: "Processing",
				detail: `Processing large file (${fileSizeMB.toFixed(1)}MB)...`,
				life: 5000,
			});
		}

		const text = await file.text();
		const result = Papa.parse(text, {
			header: true,
			skipEmptyLines: true,
			dynamicTyping: true, // Automatically parse numbers
			transformHeader: (header, index) => {
				// Handle unnamed first column (index column)
				if (!header || header.trim() === "") {
					return `__index_${index}__`; // Give it a name we can ignore
				}
				return header.trim();
			},
			transform: (value, field) => {
				// Handle numeric fields
				if (field === "step" || field === "value") {
					const num = parseFloat(value);
					return isNaN(num) ? value : num;
				}
				return value;
			},
		});

		if (result.errors.length > 0) {
			console.warn("CSV parsing warnings:", result.errors);
			// Only throw error for critical parsing issues
			const criticalErrors = result.errors.filter(
				(error) =>
					error.type === "FieldMismatch" && error.code === "TooManyFields"
			);
			if (criticalErrors.length > 0) {
				throw new Error(
					`CSV parsing errors: ${criticalErrors
						.map((e) => e.message)
						.join(", ")}`
				);
			}
		}

		const data = result.data.filter(
			(row) => row && Object.keys(row).length > 0
		);

		if (data.length === 0) {
			throw new Error("No valid data found in the CSV file");
		}

		// Get column names and handle potential index column
		const columns = Object.keys(data[0]).filter(
			(col) => col && col.trim() && !col.startsWith("__index_") // Filter out our renamed index columns
		);

		// Check for required columns (flexible column detection)
		const requiredColumns = ["experiment_id", "metric_name", "step", "value"];
		const detectedColumns = {};

		// Map columns - handle variations and extra columns
		requiredColumns.forEach((required) => {
			const found = columns.find(
				(col) =>
					col === required ||
					col.toLowerCase().includes(required.toLowerCase()) ||
					required.toLowerCase().includes(col.toLowerCase())
			);
			if (found) {
				detectedColumns[required] = found;
			}
		});

		// Check if we have all required columns
		const missingColumns = requiredColumns.filter(
			(col) => !detectedColumns[col]
		);

		if (missingColumns.length > 0) {
			throw new Error(
				`Missing required columns: ${missingColumns.join(", ")}. 
				Available columns: ${columns.join(", ")}`
			);
		}

		// Process data with column mapping
		const processedData = data
			.map((row) => ({
				experiment_id: row[detectedColumns.experiment_id],
				metric_name: row[detectedColumns.metric_name],
				step: row[detectedColumns.step],
				value: row[detectedColumns.value],
			}))
			.filter(
				(row) =>
					row.experiment_id &&
					row.metric_name &&
					typeof row.step === "number" &&
					typeof row.value === "number"
			);

		if (processedData.length === 0) {
			throw new Error("No valid experiment data found after processing");
		}

		// Process data
		await processExperimentData(processedData);

		toast.add({
			severity: "success",
			summary: "Success",
			detail: `Loaded ${experiments.value.length} experiments with ${processedData.length} data points`,
			life: 3000,
		});
	} catch (error) {
		console.error("File upload error:", error);
		toast.add({
			severity: "error",
			summary: "Error",
			detail: error.message,
			life: 5000,
		});
	} finally {
		uploading.value = false;
	}
};

const processExperimentData = async (data) => {
	const experimentMap = new Map();
	const batchSize = 10000; // Process in batches for large datasets

	// Process data in batches to avoid blocking the UI
	for (let i = 0; i < data.length; i += batchSize) {
		const batch = data.slice(i, i + batchSize);

		batch.forEach((row) => {
			const { experiment_id, metric_name, step, value } = row;

			// Skip invalid rows
			if (
				!experiment_id ||
				!metric_name ||
				typeof step !== "number" ||
				typeof value !== "number"
			) {
				return;
			}

			if (!experimentMap.has(experiment_id)) {
				experimentMap.set(experiment_id, {
					id: experiment_id,
					metrics: new Set(),
					data: new Map(),
					stepCount: 0,
					dataPointCount: 0,
				});
			}

			const experiment = experimentMap.get(experiment_id);
			experiment.metrics.add(metric_name);

			if (!experiment.data.has(metric_name)) {
				experiment.data.set(metric_name, []);
			}

			experiment.data.get(metric_name).push({ step, value });
			experiment.stepCount = Math.max(experiment.stepCount, step + 1); // +1 because steps are 0-indexed
			experiment.dataPointCount++;
		});

		// Allow UI to update between batches
		if (i % (batchSize * 5) === 0 && i > 0) {
			await new Promise((resolve) => setTimeout(resolve, 1));
		}
	}

	// Convert to array and sort data points efficiently
	experiments.value = Array.from(experimentMap.values())
		.map((exp) => {
			// Sort data points for each metric
			const sortedData = {};
			for (const [metric, points] of exp.data.entries()) {
				sortedData[metric] = points.sort((a, b) => a.step - b.step);
			}

			return {
				...exp,
				metrics: Array.from(exp.metrics).sort(), // Sort metrics for consistency
				data: sortedData,
			};
		})
		.sort((a, b) => a.id.localeCompare(b.id)); // Sort experiments by ID
};

const getTotalDataPoints = (experiment) => {
	if (experiment.dataPointCount) return experiment.dataPointCount;

	let total = 0;
	for (const points of Object.values(experiment.data)) {
		total += points.length;
	}
	return total;
};

const toggleExperimentSelection = (experimentId) => {
	const index = selectedExperiments.value.indexOf(experimentId);
	if (index === -1) {
		selectedExperiments.value.push(experimentId);
	} else {
		selectedExperiments.value.splice(index, 1);
	}
};

const selectAllExperiments = () => {
	selectedExperiments.value = filteredExperiments.value.map((exp) => exp.id);
};

const clearSelection = () => {
	selectedExperiments.value = [];
};

const getSelectedExperimentsForMetric = (metric) => {
	return selectedExperiments.value.filter((expId) => {
		const experiment = experiments.value.find((exp) => exp.id === expId);
		return experiment && experiment.metrics.includes(metric);
	});
};

const createChart = (metric, canvasElement, enableZoom = true) => {
	// Properly clean up any existing chart before creating a new one
	const existingChart = ChartJS.getChart(canvasElement);
	if (existingChart) {
		console.warn(`Destroying existing chart for ${metric} before creating new one`);
		destroyChart(existingChart);
	}

	const ctx = canvasElement.getContext("2d");

	// Validate that we have a valid context
	if (!ctx) {
		console.error(`Failed to get 2D context for ${metric}`);
		throw new Error(`Cannot get canvas context for ${metric}`);
	}

	// Ensure context is in a valid state
	try {
		// Test that context can perform basic operations
		ctx.save();
		ctx.restore();
	} catch (contextError) {
		console.error(`Canvas context is invalid for ${metric}:`, contextError);
		throw new Error(`Canvas context is invalid for ${metric}`);
	}

	// Ensure we have a valid chart type
	const currentChartType = chartType.value || "line";

	// Validate chart type
	if (!["line", "scatter"].includes(currentChartType)) {
		console.warn(`Invalid chart type: ${currentChartType}, defaulting to line`);
		chartType.value = "line";
		return createChart(metric, canvasElement, enableZoom); // Recursive call with corrected type
	}

	const datasets = selectedExperiments.value
		.filter((expId) => {
			const experiment = experiments.value.find((exp) => exp.id === expId);
			return experiment && experiment.metrics.includes(metric);
		})
		.map((expId, index) => {
			const experiment = experiments.value.find((exp) => exp.id === expId);
			const data = experiment.data[metric] || [];

			// Optimize data for large datasets - sample if too many points
			let chartData = data.map((point) => ({ x: point.step, y: point.value }));

			// For very large datasets, sample points to improve performance
			if (chartData.length > 1000) {
				const sampleRate = Math.ceil(chartData.length / 1000);
				chartData = chartData.filter((_, i) => i % sampleRate === 0);
			}

			const colors = [
				"#FF6384",
				"#36A2EB",
				"#FFCE56",
				"#4BC0C0",
				"#9966FF",
				"#FF9F40",
				"#FF6384",
				"#C9CBCF",
				"#4BC0C0",
				"#FF6384",
			];

			return {
				label: `${expId} (${data.length} points)`,
				data: chartData,
				borderColor: colors[index % colors.length],
				backgroundColor: colors[index % colors.length] + "20",
				// Chart type specific properties
				...(currentChartType === "line" && {
					tension: 0.4,
					borderWidth: 2,
					fill: false,
				}),
				...(currentChartType === "scatter" && {
					showLine: false, // Important for scatter plots
					tension: 0,
					borderWidth: 0,
					fill: false,
				}),
				pointRadius:
					currentChartType === "scatter" ? 4 : chartData.length > 500 ? 1 : 2,
				pointHoverRadius: 6,
				pointBackgroundColor: colors[index % colors.length],
				pointBorderColor: colors[index % colors.length],
			};
		});

	const config = {
		type: currentChartType,
		data: { datasets },
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: {
				duration: datasets.some((d) => d.data.length > 500) ? 0 : 1000, // Disable animation for large datasets
			},
			// Add chart type specific options
			...(currentChartType === "scatter" && {
				elements: {
					line: {
						tension: 0, // Disable line tension for scatter plots
					},
					point: {
						radius: 4,
						hoverRadius: 6,
					},
				},
			}),
			plugins: {
				title: {
					display: true,
					text: `${metric} - ${datasets.reduce(
						(sum, d) => sum + d.data.length,
						0
					)} total points`,
					font: {
						size: 14,
						weight: "bold",
					},
				},
				legend: {
					display: showLegend.value,
					position: "top",
				},
				tooltip: {
					mode: "index",
					intersect: false,
					callbacks: {
						title: function (tooltipItems) {
							return `Step: ${tooltipItems[0]?.parsed?.x || "N/A"}`;
						},
						label: function (context) {
							return `${context.dataset.label}: ${context.parsed.y.toFixed(6)}`;
						},
					},
				},
				// Only add zoom if enabled
				...(enableZoom && {
					zoom: {
						pan: {
							enabled: true,
							mode: "xy",
							modifierKey: "ctrl",
							onPanStart: (context) => {
								try {
									// Check if we're in the middle of updating charts
									if (isUpdatingCharts.value) {
										return false;
									}
									const chart = context?.chart;
									// Check chart validity including destroyed status and DOM presence
									if (!chart?.canvas?.parentNode || chart.destroyed) {
										return false;
									}
									if (!document.contains(chart.canvas)) {
										return false;
									}
									// Additional check for canvas bounding rect availability
									try {
										chart.canvas.getBoundingClientRect();
									} catch (rectError) {
										console.warn(
											"Canvas getBoundingClientRect failed, canceling pan start"
										);
										return false;
									}
									return true;
								} catch (error) {
									console.warn("Pan start validation failed:", error);
									return false;
								}
							},
							onPan: (context) => {
								try {
									// Check if we're in the middle of updating charts
									if (isUpdatingCharts.value) {
										return false;
									}
									const chart = context?.chart;
									if (
										!chart?.canvas?.parentNode ||
										chart.destroyed ||
										!document.contains(chart.canvas)
									) {
										return false;
									}
									// Additional check for canvas bounding rect availability
									try {
										chart.canvas.getBoundingClientRect();
									} catch (rectError) {
										console.warn(
											"Canvas getBoundingClientRect failed, canceling pan"
										);
										return false;
									}
									return true;
								} catch (error) {
									console.warn("Pan validation failed:", error);
									return false;
								}
							},
						},
						zoom: {
							wheel: {
								enabled: true,
							},
							pinch: {
								enabled: true,
							},
							drag: {
								enabled: true,
								backgroundColor: "rgba(54, 162, 235, 0.2)",
								borderColor: "rgba(54, 162, 235, 1)",
								borderWidth: 1,
							},
							mode: "xy",
							onZoomStart: (context) => {
								try {
									// Check if we're in the middle of updating charts
									if (isUpdatingCharts.value) {
										return false;
									}
									const chart = context?.chart;
									// Check chart validity including destroyed status and DOM presence
									if (!chart?.canvas?.parentNode || chart.destroyed) {
										return false;
									}
									if (!document.contains(chart.canvas)) {
										return false;
									}
									// Additional check for canvas bounding rect availability
									try {
										chart.canvas.getBoundingClientRect();
									} catch (rectError) {
										console.warn(
											"Canvas getBoundingClientRect failed, canceling zoom start"
										);
										return false;
									}
									return true;
								} catch (error) {
									console.warn("Zoom start validation failed:", error);
									return false;
								}
							},
							onZoom: (context) => {
								try {
									// Check if we're in the middle of updating charts
									if (isUpdatingCharts.value) {
										return false;
									}
									const chart = context?.chart;
									if (
										!chart?.canvas?.parentNode ||
										chart.destroyed ||
										!document.contains(chart.canvas)
									) {
										return false;
									}
									// Additional check for canvas bounding rect availability
									try {
										chart.canvas.getBoundingClientRect();
									} catch (rectError) {
										console.warn(
											"Canvas getBoundingClientRect failed, canceling zoom"
										);
										return false;
									}
									return true;
								} catch (error) {
									console.warn("Zoom validation failed:", error);
									return false;
								}
							},
							onZoomComplete: (context) => {
								try {
									// Check if we're in the middle of updating charts
									if (isUpdatingCharts.value) {
										return false;
									}
									const chart = context?.chart;
									if (
										!chart?.canvas?.parentNode ||
										chart.destroyed ||
										!document.contains(chart.canvas)
									) {
										return false;
									}
									// Additional check for canvas bounding rect availability
									try {
										chart.canvas.getBoundingClientRect();
									} catch (rectError) {
										console.warn(
											"Canvas getBoundingClientRect failed, ignoring zoom complete"
										);
										return false;
									}
									return true;
								} catch (error) {
									console.warn("Zoom complete validation failed:", error);
									return false;
								}
							},
						},
						limits: {
							x: { min: "original", max: "original" },
							y: { min: "original", max: "original" },
						},
					},
				}),
			},
			scales: {
				x: {
					type: "linear",
					display: true,
					title: {
						display: true,
						text: "Step",
					},
				},
				y: {
					display: true,
					title: {
						display: true,
						text: "Value",
					},
					ticks: {
						callback: function (value) {
							return typeof value === "number" ? value.toFixed(3) : value;
						},
					},
				},
			},
			interaction: {
				mode: "nearest",
				axis: "x",
				intersect: false,
			},
			elements: {
				point: {
					hoverRadius: 8,
				},
			},
		},
	};

	try {
		// Pre-validate chart creation for scatter plots
		if (currentChartType === "scatter") {
			// Validate datasets have proper x/y structure for scatter
			const hasValidScatterData = datasets.every(
				(dataset) =>
					Array.isArray(dataset.data) &&
					dataset.data.every(
						(point) =>
							point &&
							typeof point === "object" &&
							typeof point.x === "number" &&
							typeof point.y === "number"
					)
			);

			if (!hasValidScatterData) {
				console.warn(
					`Invalid scatter data structure for ${metric}, falling back to line chart`
				);
				config.type = "line";
				currentChartType = "line";
			}
		}

		const chart = new ChartJS(ctx, config);
		return chart;
	} catch (error) {
		console.error(
			`Failed to create ${currentChartType} chart for ${metric}:`,
			error
		);

		// If scatter chart fails, try falling back to line chart
		if (currentChartType === "scatter") {
			const fallbackConfig = {
				...config,
				type: "line",
			};
			try {
				const fallbackChart = new ChartJS(ctx, fallbackConfig);
				return fallbackChart;
			} catch (fallbackError) {
				console.error(
					`Fallback line chart also failed for ${metric}:`,
					fallbackError
				);
				throw fallbackError;
			}
		}
		throw error;
	}
};

// Helper function to safely destroy a chart
const destroyChart = (chart) => {
	if (!chart || typeof chart.destroy !== "function") {
		return false;
	}

	try {
		// First, check if chart is already destroyed to avoid double-destruction
		if (chart.destroyed) {
			console.warn("Chart is already destroyed");
			return true;
		}

		// Stop any ongoing updates or animations first
		if (chart.stop && typeof chart.stop === "function") {
			chart.stop();
		}

		// Disable zoom/pan interactions before destroying
		if (chart.options?.plugins?.zoom) {
			try {
				// Temporarily disable zoom interactions to prevent errors during destruction
				chart.options.plugins.zoom.pan.enabled = false;
				chart.options.plugins.zoom.zoom.wheel.enabled = false;
				chart.options.plugins.zoom.zoom.pinch.enabled = false;
				chart.options.plugins.zoom.zoom.drag.enabled = false;
			} catch (zoomError) {
				console.warn(
					"Error disabling zoom during chart destruction:",
					zoomError
				);
			}
		}

		// Unbind events if method exists
		if (chart.unbindEvents && typeof chart.unbindEvents === "function") {
			chart.unbindEvents();
		}

		// Finally destroy the chart
		chart.destroy();
		return true;
	} catch (error) {
		console.warn("Error destroying chart:", error);
		return false;
	}
};

// Helper function to clean canvas completely
const cleanCanvas = (canvas) => {
	if (!canvas) return;

	try {
		// Remove any existing Chart.js instance using multiple approaches
		let attempts = 0;
		while (attempts < 3) {
			const existingChart = ChartJS.getChart(canvas);
			if (!existingChart) break;

			console.warn(`Cleaning existing chart (attempt ${attempts + 1})`);
			destroyChart(existingChart);
			attempts++;
		}

		// Force remove from Chart.js registry with multiple methods
		if (canvas.chart) {
			canvas.chart = null;
		}

		// Clear canvas ID to prevent Chart.js tracking issues
		const canvasId = canvas.getAttribute("data-chartjs-id");
		if (canvasId) {
			canvas.removeAttribute("data-chartjs-id");
		}

		// Remove any zoom plugin event listeners or state
		if (canvas._chartjs) {
			delete canvas._chartjs;
		}

		// Clear any custom properties that might hold references
		Object.getOwnPropertyNames(canvas).forEach((prop) => {
			if (prop.startsWith("_chart") || prop.startsWith("__chart")) {
				try {
					delete canvas[prop];
				} catch (e) {
					// Ignore errors when deleting non-configurable properties
				}
			}
		});

		// Get canvas dimensions before clearing
		const { width, height } = canvas.getBoundingClientRect();

		// Reset canvas dimensions properly
		if (width > 0 && height > 0) {
			// Clear by resetting dimensions - this is the safest approach
			canvas.width = width * window.devicePixelRatio;
			canvas.height = height * window.devicePixelRatio;

			// Get fresh context after dimension reset
			const ctx = canvas.getContext("2d");
			if (ctx) {
				// Set proper scaling for high DPI displays
				ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

				// Ensure context is in clean state
				ctx.globalCompositeOperation = "source-over";
				ctx.globalAlpha = 1;

				// Clear the canvas completely
				ctx.clearRect(0, 0, width, height);
			}
		}
	} catch (error) {
		console.warn("Error cleaning canvas:", error);
		// If cleaning fails, try a basic clear
		try {
			const ctx = canvas.getContext("2d");
			if (ctx && canvas.width > 0 && canvas.height > 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		} catch (fallbackError) {
			console.warn("Fallback canvas clear also failed:", fallbackError);
		}
	}
};

const updateCharts = async () => {
	// Set flag to prevent zoom interactions during update
	isUpdatingCharts.value = true;

	try {
		// Destroy existing charts cleanly
		Object.entries(charts.value).forEach(([metric, chart]) => {
			if (chart) {
				destroyChart(chart);
			}
		});
		charts.value = {};

		// Clean canvases without DOM manipulation - let Vue handle the DOM
		Object.entries(chartRefs.value).forEach(([metric, canvas]) => {
			if (canvas) {
				const existingChart = ChartJS.getChart(canvas);
				if (existingChart) {
					destroyChart(existingChart);
				}
				// Clear canvas attributes but don't recreate DOM elements
				if (canvas.chart) canvas.chart = null;
				const canvasId = canvas.getAttribute("data-chartjs-id");
				if (canvasId) canvas.removeAttribute("data-chartjs-id");
			}
		});

		if (selectedExperiments.value.length === 0) {
			return;
		}

		// Wait for Vue to finish any DOM updates
		await nextTick();
		// Additional short delay to ensure cleanup is complete
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Create new charts

		// Create new charts
		for (const metric of selectedMetrics.value) {
			const canvas = chartRefs.value[metric];
			if (canvas && canvas.parentNode && document.contains(canvas)) {
				try {
					// Verify no existing chart
					const existingChart = ChartJS.getChart(canvas);
					if (existingChart) {
						destroyChart(existingChart);
						await new Promise((resolve) => setTimeout(resolve, 50));
					}

					// Create chart with zoom enabled from the start
					charts.value[metric] = createChart(metric, canvas, true);
				} catch (error) {
					console.error(`Error creating chart for ${metric}:`, error);
				}
			}
		}
	} catch (error) {
		console.error("Error in updateCharts:", error);
	} finally {
		// Always clear the updating flag
		isUpdatingCharts.value = false;
	}
};

const toggleTheme = () => {
	isDark.value = !isDark.value;
	document.documentElement.classList.toggle("dark-mode", isDark.value);
};

const resetData = () => {
	experiments.value = [];
	selectedExperiments.value = [];
	searchQuery.value = "";
	selectedMetricFilter.value = null;

	// Use proper chart cleanup
	Object.values(charts.value).forEach((chart) => destroyChart(chart));
	charts.value = {};

	// Clean all canvases
	Object.values(chartRefs.value).forEach((canvas) => cleanCanvas(canvas));
};

const resetChartZoom = (metric) => {
	const chart = charts.value[metric];
	if (!chart) return;

	try {
		// Comprehensive chart validity check before zoom operations
		if (
			!chart.canvas ||
			!chart.canvas.parentNode ||
			!chart.canvas.ownerDocument ||
			chart.destroyed ||
			!document.contains(chart.canvas)
		) {
			console.warn(`Chart for ${metric} is not valid for zoom reset`);
			return;
		}

		// Additional check for zoom plugin availability
		if (typeof chart.resetZoom !== "function") {
			console.warn(`Chart for ${metric} does not have zoom functionality`);
			return;
		}

		// Safe zoom reset with error handling
		chart.resetZoom("none"); // Disable animation for safety
	} catch (error) {
		console.warn(`Error resetting zoom for ${metric}:`, error);

		// If zoom reset fails, try to recreate the chart as fallback
		const canvas = chartRefs.value[metric];
		if (canvas && canvas.parentNode && document.contains(canvas)) {
			try {
				cleanCanvas(canvas);
				// Add a small delay to ensure cleanup is complete
				setTimeout(() => {
					try {
						charts.value[metric] = createChart(metric, canvas, false);
						// Add zoom after delay for reset recreation too
						setTimeout(() => {
							try {
								const chart = charts.value[metric];
								if (
									chart &&
									chart.canvas &&
									chart.canvas.parentNode &&
									document.contains(chart.canvas)
								) {
									chart.options.plugins.zoom = {
										pan: { enabled: true, mode: "xy", modifierKey: "ctrl" },
										zoom: {
											wheel: { enabled: true },
											pinch: { enabled: true },
											drag: {
												enabled: true,
												backgroundColor: "rgba(54, 162, 235, 0.2)",
												borderColor: "rgba(54, 162, 235, 1)",
												borderWidth: 1,
											},
											mode: "xy",
										},
										limits: {
											x: { min: "original", max: "original" },
											y: { min: "original", max: "original" },
										},
									};
									chart.update("none");
								}
							} catch (zoomError) {
								console.warn(
									`Error adding zoom after reset recreation:`,
									zoomError
								);
							}
						}, 500);
					} catch (recreateError) {
						console.error(
							`Failed to recreate chart after zoom reset error:`,
							recreateError
						);
					}
				}, 100);
			} catch (recreateError) {
				console.error(
					`Failed to setup chart recreation for ${metric}:`,
					recreateError
				);
			}
		}
	}
};

const resetAllZoom = () => {
	Object.entries(charts.value).forEach(([metric, chart]) => {
		if (!chart) return;

		try {
			// Comprehensive chart validity check before zoom operations
			if (
				!chart.canvas ||
				!chart.canvas.parentNode ||
				!chart.canvas.ownerDocument ||
				chart.destroyed ||
				!document.contains(chart.canvas)
			) {
				console.warn(`Chart for ${metric} is not valid for zoom reset`);
				return;
			}

			// Additional check for zoom plugin availability
			if (typeof chart.resetZoom !== "function") {
				console.warn(`Chart for ${metric} does not have zoom functionality`);
				return;
			}

			// Safe zoom reset with error handling
			chart.resetZoom("none"); // Disable animation for safety
		} catch (error) {
			console.warn(`Error resetting zoom for ${metric}:`, error);
		}
	});
};

const fitChartToData = (metric) => {
	const chart = charts.value[metric];
	if (!chart) return;

	try {
		// Comprehensive chart validity check
		if (
			!chart.canvas ||
			!chart.canvas.parentNode ||
			!chart.canvas.ownerDocument ||
			chart.destroyed ||
			!document.contains(chart.canvas)
		) {
			console.warn(`Chart for ${metric} is not valid for data fitting`);
			return;
		}

		// Get data bounds
		const datasets = chart.data?.datasets;
		if (!datasets || datasets.length === 0) return;

		let minX = Infinity,
			maxX = -Infinity;
		let minY = Infinity,
			maxY = -Infinity;

		datasets.forEach((dataset) => {
			if (dataset.data && Array.isArray(dataset.data)) {
				dataset.data.forEach((point) => {
					if (
						point &&
						typeof point === "object" &&
						point.x !== undefined &&
						point.y !== undefined
					) {
						minX = Math.min(minX, point.x);
						maxX = Math.max(maxX, point.x);
						minY = Math.min(minY, point.y);
						maxY = Math.max(maxY, point.y);
					}
				});
			}
		});

		// Validate bounds
		if (
			!isFinite(minX) ||
			!isFinite(maxX) ||
			!isFinite(minY) ||
			!isFinite(maxY)
		) {
			console.warn(`Invalid data bounds for ${metric}`);
			return;
		}

		// Add some padding
		const xPadding = (maxX - minX) * 0.05;
		const yPadding = (maxY - minY) * 0.05;

		// Zoom to fit data using zoom scale if available
		if (chart.zoomScale && typeof chart.zoomScale === "function") {
			chart.zoomScale("x", { min: minX - xPadding, max: maxX + xPadding });
			chart.zoomScale("y", { min: minY - yPadding, max: maxY + yPadding });
		} else {
			console.warn(`Chart for ${metric} does not support zoom scaling`);
		}
	} catch (error) {
		console.warn(`Error fitting chart to data for ${metric}:`, error);
	}
};

const exportSelection = () => {
	const selectedData = [];

	selectedExperiments.value.forEach((expId) => {
		const experiment = experiments.value.find((exp) => exp.id === expId);
		if (experiment) {
			experiment.metrics.forEach((metric) => {
				const points = experiment.data[metric] || [];
				points.forEach((point) => {
					selectedData.push({
						experiment_id: expId,
						metric_name: metric,
						step: point.step,
						value: point.value,
					});
				});
			});
		}
	});

	const csv = Papa.unparse(selectedData);
	const blob = new Blob([csv], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `selected-experiments-${
		new Date().toISOString().split("T")[0]
	}.csv`;
	a.click();
	URL.revokeObjectURL(url);

	toast.add({
		severity: "success",
		summary: "Exported",
		detail: `Downloaded ${selectedData.length} data points`,
		life: 3000,
	});
};

// Add debouncing for chart updates
let updateChartsTimeout = null;

const debouncedUpdateCharts = () => {
	if (updateChartsTimeout) {
		clearTimeout(updateChartsTimeout);
	}
	updateChartsTimeout = setTimeout(() => {
		// Ensure chartType is valid before updating charts
		if (!chartType.value) {
			chartType.value = "line"; // Reset to default if null
		}
		updateCharts();
	}, 150); // 150ms debounce
};

// Watchers
watch([selectedExperiments, chartType, showLegend], debouncedUpdateCharts, {
	deep: true,
});

// Lifecycle
onMounted(() => {
	// Initialize theme based on system preference
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	isDark.value = prefersDark;
	document.documentElement.classList.toggle("dark-mode", isDark.value);
});

// Cleanup on component unmount
onBeforeUnmount(() => {
	// Clear any pending chart updates
	if (updateChartsTimeout) {
		clearTimeout(updateChartsTimeout);
	}

	// Restore original console.error
	console.error = originalConsoleError;

	// Restore original getBoundingClientRect
	HTMLCanvasElement.prototype.getBoundingClientRect =
		originalGetBoundingClientRect;
	Element.prototype.getBoundingClientRect =
		originalElementGetBoundingClientRect;

	// Destroy all charts to prevent memory leaks
	Object.values(charts.value).forEach((chart) => destroyChart(chart));
	charts.value = {};

	// Clean all canvases
	Object.values(chartRefs.value).forEach((canvas) => cleanCanvas(canvas));
	chartRefs.value = {};
});
</script>

<style scoped>
.experiment-tracker {
	min-height: 100vh;
	background: var(--p-surface-ground);
}

.header {
	background: var(--p-surface-card);
	border-bottom: 1px solid var(--p-border-color);
	padding: 1rem 0;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
}

.header-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin: 0;
	color: var(--p-text-color);
	font-size: 1.75rem;
	font-weight: 600;
}

.subtitle {
	margin: 0.25rem 0 0 0;
	color: var(--p-text-muted-color);
	font-size: 0.875rem;
}

.theme-toggle {
	margin-left: auto;
}

.main-content {
	padding: 2rem 0;
}

.upload-card {
	max-width: 600px;
	margin: 0 auto;
}

.upload-header {
	text-align: center;
	padding: 2rem 0 1rem;
}

.upload-icon {
	font-size: 3rem;
	color: var(--p-primary-color);
	margin-bottom: 1rem;
}

.upload-area {
	text-align: center;
	padding: 2rem;
}

.upload-button {
	margin-bottom: 2rem;
}

.upload-info {
	text-align: left;
	background: var(--p-surface-50);
	padding: 1.5rem;
	border-radius: 0.5rem;
	border: 1px solid var(--p-border-color);
}

.upload-info ul {
	margin: 0.5rem 0 0 0;
	padding-left: 1.5rem;
}

.upload-info li {
	margin: 0.5rem 0;
}

.dashboard {
	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-template-rows: auto 1fr;
	gap: 2rem;
	align-items: start;
}

.stats-panel {
	grid-column: 1 / -1;
	margin-bottom: 1rem;
}

.zoom-info-panel {
	grid-column: 1 / -1;
	margin-bottom: 1rem;
}

.zoom-instructions {
	padding: 1rem;
}

.instruction-header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 1rem;
	font-weight: 600;
	color: var(--p-primary-color);
}

.instruction-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 0.5rem;
}

.instruction-item {
	padding: 0.5rem;
	background: var(--p-surface-50);
	border-radius: 0.25rem;
	border: 1px solid var(--p-border-color);
	font-size: 0.875rem;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
	padding: 1rem;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background: var(--p-surface-50);
	border-radius: 0.5rem;
	border: 1px solid var(--p-border-color);
}

.stat-icon {
	font-size: 2rem;
	color: var(--p-primary-color);
	opacity: 0.8;
}

.stat-content {
	flex: 1;
}

.stat-value {
	font-size: 1.5rem;
	font-weight: 600;
	color: var(--p-text-color);
	margin-bottom: 0.25rem;
}

.stat-label {
	font-size: 0.875rem;
	color: var(--p-text-muted-color);
}

@media (max-width: 768px) {
	.dashboard {
		grid-template-columns: 1fr;
	}
}

.panel-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem;
	border-bottom: 1px solid var(--p-border-color);
}

.panel-header h3 {
	margin: 0;
}

.panel-actions {
	display: flex;
	gap: 0.5rem;
}

.experiment-controls {
	padding: 1rem;
}

.search-filter {
	display: flex;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.search-input {
	flex: 1;
}

.metric-filter {
	min-width: 200px;
}

.experiment-list-section {
	margin-bottom: 1rem;
	position: sticky;
	top: 1rem;
	z-index: 10;
	background: var(--p-surface-ground);
	padding: 1rem;
	border-radius: 0.5rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
}

.list-header h4 {
	margin: 0;
}

.list-actions {
	display: flex;
	gap: 0.5rem;
}

.experiment-list {
	max-height: 600px;
	overflow-y: auto;
	border: 1px solid var(--p-border-color);
	border-radius: 0.5rem;
	background: var(--p-surface-card);
}

.experiment-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem;
	border-bottom: 1px solid var(--p-border-color);
	cursor: pointer;
	transition: background-color 0.2s;
}

.experiment-item:hover {
	background: var(--p-surface-hover);
}

.experiment-item.selected {
	background: var(--p-primary-50);
	border-color: var(--p-primary-200);
}

.experiment-item:last-child {
	border-bottom: none;
}

.experiment-info {
	flex: 1;
}

.experiment-name {
	font-weight: 500;
	cursor: pointer;
	display: block;
	margin-bottom: 0.5rem;
}

.experiment-meta {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.metric-tag {
	font-size: 0.75rem;
}

.step-count,
.data-count {
	font-size: 0.75rem;
	color: var(--p-text-muted-color);
	background: var(--p-surface-50);
	padding: 0.25rem 0.5rem;
	border-radius: 0.25rem;
	border: 1px solid var(--p-border-color);
}

.visualization-panel {
	min-height: 600px;
}

.chart-controls {
	display: flex;
	gap: 1rem;
	align-items: center;
	flex-wrap: wrap;
}

.zoom-controls {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	padding: 0.25rem;
	border: 1px solid var(--p-border-color);
	border-radius: 0.375rem;
	background: var(--p-surface-50);
}

.chart-meta {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.individual-chart-controls {
	display: flex;
	gap: 0.25rem;
	align-items: center;
}

.charts-container {
	padding: 1rem;
}

.chart-wrapper {
	margin-bottom: 3rem;
}

.chart-wrapper:last-child {
	margin-bottom: 0;
}

.chart-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
}

.chart-header h4 {
	margin: 0;
}

.chart-container {
	height: 400px;
	position: relative;
}

.chart-canvas {
	width: 100% !important;
	height: 100% !important;
}

.no-selection {
	min-height: 400px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.no-selection-content {
	text-align: center;
	color: var(--p-text-muted-color);
}

.no-selection-icon {
	font-size: 4rem;
	margin-bottom: 1rem;
	opacity: 0.5;
}

.no-selection-content h3 {
	margin: 0 0 0.5rem 0;
}

.no-selection-content p {
	margin: 0;
	max-width: 300px;
}

/* Dark mode adjustments */
:global(.dark-mode) {
	--p-surface-ground: #0f172a;
	--p-surface-card: #1e293b;
	--p-text-color: #f1f5f9;
	--p-text-muted-color: #94a3b8;
	--p-border-color: #334155;
	--p-surface-50: #1e293b;
	--p-surface-hover: #334155;
	--p-primary-50: #1e40af20;
	--p-primary-200: #3b82f6;
}
</style>
