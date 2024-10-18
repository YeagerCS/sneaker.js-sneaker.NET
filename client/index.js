import { render } from "sneakerlib";
import { AppComponent } from "./src/components/App/App.snkr"


const load = async () => {
    await render(AppComponent, "root")
}

document.addEventListener("DOMContentLoaded", async () => {
    await load();
})