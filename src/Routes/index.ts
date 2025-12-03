import { createBrowserRouter } from "react-router";
import { Paths } from "./paths";
import Home from "@/Pages/Home/Home";
import ProjectPage from "@/Pages/Project/ProjectPage";
import App from "@/App";

export const router = createBrowserRouter([
    {
        path: Paths.home,
        Component: App,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: Paths.projectPage,
                Component: ProjectPage
            }
        ]
    }
])