// NOTE: IMPORT OTHER CONSTANTS AND DEPENDENCIES
import Root from "../Layout/Root";
import {createBrowserRouter} from "react-router-dom";

// NOTE: IMPORT THREAD PAGES
// import Thread from "../pages/Thread/Thread";
import Thread from "../pages/Thread";

// NOTE: IMPORT COMMON PAGES
import InternalServerErrorPage from "../pages/InternalServerError";
import ErrorOccurPage from "../pages/Error";
import NotFoundPage from "../pages/NotFoundError";

// NOTE: IMPORT HOOKS
import {
    ProtectedClientRoute,
    ProtectedRedirect,
    ProtectedRoute,
    ProtectedTaskerRoute,
    PublicRoute,
} from "../components/routing/protectedAndPublicRoute";
import KidsplanClientHomePage from "../pages/ClientHome";
import TestReusableComponents from "../pages/TestReusableComponents";
import RequestCollection from "../pages/CollectionRequest";
import Sensors from "../pages/Sensors";
import MyProduction from "../pages/MyProduction";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorOccurPage/>,
        children: [
            {
                index: true,
                element: <KidsplanClientHomePage/>,
            },

            // NOTE: Public Routes
            {
                path: "",
                element: <PublicRoute/>,
                children: [
                    {
                        path: "/collection-request",
                        element: <RequestCollection/>,
                    },
                    {
                        path: "/devices",
                        element: <Sensors/>,
                    },
                    {
                        path: "/my-production",
                        element: <MyProduction/>,
                    },
                ],
            },

            // NOTE: protected routes
            {
                element: <ProtectedClientRoute/>,
                children: [
                    {
                        path: "/chat",
                        element: <Thread/>,
                    },
                ],
            },
        ],
    },

    // Test Routes
    {
        path: "reusable",
        element: <TestReusableComponents/>,
        errorElement: <ErrorOccurPage/>
    },
    // {
    //     path: "/test-confirmation",
    //     element: <UseConfirmationTesting/>,
    //     errorElement: <ErrorOccurPage/>
    // },

    // NOTE: Error Pages
    {
        path: "/server-error",
        element: <InternalServerErrorPage/>,
        errorElement: <ErrorOccurPage/>

    },
    {
        path: "/error",
        element: <ErrorOccurPage/>,
        errorElement: <ErrorOccurPage/>

    },
    {
        path: "*",
        element: <NotFoundPage/>,
        errorElement: <ErrorOccurPage/>
    },
]);

export default router;
