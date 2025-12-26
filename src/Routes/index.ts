import { createBrowserRouter } from "react-router"; 
import { Paths } from "./paths";
import App from "@/App";
import Home from "@/Pages/Home/Home";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

export const router = createBrowserRouter([
    {
        path: Paths.home, 
        Component: App, 
        children: [
            {
                ErrorBoundary: ErrorBoundary,
                children: [
                    {
                        index: true,
                        Component: Home,
                    },
                    {
                        path: Paths.projectPage,
                        lazy: async () => {
                            const module = await import("@/Pages/Project/ProjectPage");
                            return { Component: module.default }
                        },
                    },
                    {
                        path: "*",
                        Component: ErrorBoundary,
                    }
                ]
            }
        ]
    }
]);