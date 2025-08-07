import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "./style.css";
import App from "./App.vue";
import ExperimentTracker from "./components/ExperimentTracker.vue";

const routes = [{ path: "/", component: ExperimentTracker }];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

const app = createApp(App);

app.use(PrimeVue, {
	ripple: true,
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(router);
app.directive("tooltip", Tooltip);

app.mount("#app");
