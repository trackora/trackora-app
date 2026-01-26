import { AppRegistry } from "react-native";
import { createRoot } from "react-dom/client";
import { name as appName } from "./app.json";
import App from "./src/App";

AppRegistry.registerComponent(appName, () => App);

const rootTag = document.getElementById("root");
const root = createRoot(rootTag);
AppRegistry.runApplication(appName, { rootTag });
