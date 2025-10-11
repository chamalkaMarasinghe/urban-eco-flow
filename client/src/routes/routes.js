// NOTE: IMPORT OTHER CONSTANTS AND DEPENDENCIES
import Root from "../Layout/Root";
import {createBrowserRouter} from "react-router-dom";

// NOTE: IMPORT COMMON PAGES
import InternalServerErrorPage from "../pages/InternalServerError";
import ErrorOccurPage from "../pages/Error";
import NotFoundPage from "../pages/NotFoundError";

// NOTE: IMPORT HOOKS
import {
    ProtectedClientRoute,
    PublicRoute,
} from "../components/routing/protectedAndPublicRoute";
import ClientHomePage from "../pages/ClientHome";
import RequestCollection from "../pages/CollectionRequest";
import Sensors from "../pages/Sensors";
import MySensors from "../pages/MySensors";
import MyBins from "../pages/MyBins";
import MyProduction from "../pages/MyProduction";
import CreateBins from "../pages/CreateBins";
import MyOrders from "../pages/MyOrders";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorOccurPage/>,
        children: [
            {
                index: true,
                element: <ClientHomePage/>,
            },

            // NOTE: Public Routes
            {
                path: "",
                element: <PublicRoute/>,
                children: [
                ],
            },

            // NOTE: protected routes
            {
                element: <ProtectedClientRoute/>,
                children: [
                    {
                        path: "/create-bin",
                        element: <CreateBins/>,
                    },
                    {
                        path: "/collection-request",
                        element: <RequestCollection/>,
                    },
                    {
                        path: "/devices",
                        element: <Sensors/>,
                    },
                    {
                        path: "/my-sensors",
                        element: <MySensors/>,
                    },
                    {
                        path: "/my-bins",
                        element: <MyBins />,
                    },
                    {
                        path: "/all-orders",
                        element: <MyOrders />,
                    },
                    {
                        path: "/my-production",
                        element: <MyProduction/>,
                    },
                ],
            },
        ],
    },

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
