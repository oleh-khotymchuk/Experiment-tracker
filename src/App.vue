<template>
	<div id="app">
		<Toast />
		<ConfirmDialog />
		<router-view />
	</div>
</template>

<script setup>
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
</script>

<style>
body {
	font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica,
		Arial, sans-serif;
	margin: 0;
	padding: 0;
	background-color: var(--p-surface-ground);
}

#app {
	min-height: 100vh;
}
</style>
