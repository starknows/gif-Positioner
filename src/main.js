import App from "./App.svelte";
import init from "./gif-player";
init();
const app = new App({
    target: document.body,
    props: {},
});

export default app;
