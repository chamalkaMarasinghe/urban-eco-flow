import React, { useEffect, useState, useMemo } from "react";
import { Pagination, Skeleton, Table } from "antd";
import { useSearchParams } from "react-router-dom";
import CustomExpandIcon from "../CustomExpandIcon";
import { useThunk } from "../../hooks/useThunk";

const DataTable = ({
    columns,
    fetchData,
    setMetaData = null,
    rowKey = "_id",
    filters = {},
    initialPageSize = 10,
    tableStyle = {},
    headingBgColor = "#DDE1E6",
    headingTextColor = "#5C5F6A",
    enableUrlParams = true,
    customQueryParams,
    dataSource,
    hasSubTable = false, // Prop to enable sub-table
    subTableConfig = {}, // Configuration for sub-table (columns, data field)
    refreshTrigger = 0, // Refresh trigger for the table
    setStaticalData = null,
    setLoadingReport = null,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    // Use the custom useThunk hook to fetch data
    const [doFetchData, isFetchingData, fetchDataError] = useThunk(fetchData);

    // Get pagination values from URL params or use defaults
    const currentPage = Number(searchParams.get("page")) || 1;
    const currentPageSize =
        Number(searchParams.get("pageSize")) || initialPageSize;

    // Update URL parameters and return the updated params object
    const updateUrlParams = (newParams) => {
        if (!enableUrlParams) return newParams;

        const updatedParams = new URLSearchParams(searchParams);

        // Update or remove parameters
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                updatedParams.set(key, value.toString());
            } else {
                updatedParams.delete(key);
            }
        });

        setSearchParams(updatedParams, { replace: true });
        return newParams;
    };

    useEffect(() => {
        // Create a reference to the previous filters
        const filterValues = Object.entries(filters).filter(
            ([_, value]) => value !== undefined && value !== null && value !== ""
        );

        if (filterValues.length > 0) {
            const newParams = new URLSearchParams(searchParams.toString());

            // Update filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== "") {
                    newParams.set(key, value);
                } else {
                    newParams.delete(key);
                }
            });

            // Reset page to 1 ONLY when filters change, not on component mount
            // newParams.set("page", "1");

            // Only update if something actually changed to avoid unnecessary rerenders
            if (newParams.toString() !== searchParams.toString()) {
                setSearchParams(newParams);
            }
        }
    }, [filters]);

    // Get all current parameters (pagination, sorting, filters)
    const getCurrentParams = () => {
        const params = {
            page: currentPage,
            pageSize: currentPageSize,
            sortField: searchParams.get("sortField") || "",
            sortOrder: searchParams.get("sortOrder") || "",
        };

        // Add all active filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params[key] = value;
            }
        });

        // Add any other search params not covered by filters
        Array.from(searchParams.entries()).forEach(([key, value]) => {
            if (
                !params[key] &&
                !["page", "pageSize", "sortField", "sortOrder"].includes(key)
            ) {
                params[key] = value;
            }
        });

        return params;
    };

    // Load data from API
    const loadData = async () => {
        try {
            setLoading(true);

            // Get current parameters
            const params = getCurrentParams();

            // Convert page & pageSize to offset & limit for API
            const apiParams = { ...params };
            apiParams.offset = (params.page - 1) * params.pageSize;
            apiParams.limit = params.pageSize;

            // Remove UI pagination params
            delete apiParams.page;
            delete apiParams.pageSize;

            // Apply any custom transformations
            const backendParams = customQueryParams
                ? customQueryParams(apiParams)
                : apiParams;

            const result = await doFetchData({...backendParams, isOrders: true});

            if (result?.success) {
                setData(result?.response?.data?.data || []);
                if(setMetaData) setMetaData(result?.response?.data);
                setTotalItems(result?.response?.data?.pagination?.totalDocuments || 0);
            } else {
                console.error("Error fetching data:", result?.error);
                setData([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    // Load data when component mounts or when relevant params change
    useEffect(() => {
        loadData();
    }, [
        currentPage,
        currentPageSize,
        searchParams.get("sortField"),
        searchParams.get("sortOrder"),
        JSON.stringify(filters),
        refreshTrigger,
    ]);

    // Update Loading state for category report
    useEffect(() => {
        if (setLoadingReport) {
            setLoadingReport(isFetchingData);
        }
    }, [isFetchingData]);

    // Handle pagination change
    const handlePaginationChange = (page, pageSize) => {
        // Update URL params directly
        updateUrlParams({
            page: page,
            pageSize: pageSize,
        });

        // Data will be loaded in the useEffect when URL params change
    };

    // Handle table sorting
    const handleTableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            // Update sort params and reset to page 1
            updateUrlParams({
                sortField: sorter.field,
                sortOrder: sorter.order,
                page: 1,
            });
        } else if (searchParams.has("sortField") || searchParams.has("sortOrder")) {
            // Clear sorting if it was previously set
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("sortField");
            newParams.delete("sortOrder");
            setSearchParams(newParams);
        }
    };

    // Enhanced columns with conditional sorting
    const enhancedColumns = columns.map((col) => ({
        ...col,
        sorter: col.sortable === true ? true : false,
        sortOrder:
            searchParams.get("sortField") === col.key
                ? searchParams.get("sortOrder")
                : null,
        onCell: () => ({
            style: {
                maxWidth: col.maxWidth || "auto",
                whiteSpace: col.maxWidth ? "nowrap" : "pre-wrap",
                overflow: col.maxWidth ? "hidden" : "visible",
                textOverflow: col.maxWidth ? "ellipsis" : "clip",
                minWidth: col.minWidth || "100px", // default minWidth here
            },
        }),

        // Handle nested data paths in dataIndex
        render:
            col.render ||
            ((text, record) => {
                if (typeof col.dataIndex === "string") {
                    return text;
                }
                // Handle array dataIndex for nested data
                if (Array.isArray(col.dataIndex)) {
                    let value = record;
                    for (const key of col.dataIndex) {
                        value = value?.[key];
                    }
                    return value;
                }
                return text;
            }),
    }));

    // sub-table render function to handle both nested and parent data
    const expandedRowRender = (record) => {
        if (!hasSubTable || !subTableConfig.columns) {
            return null;
        }

        // Create a combined data object that includes both parent and nested data
        // const subTableData = {
        //   ...record,
        //   ...(subTableConfig.dataField
        //     ? { paymentDetails: record[subTableConfig.dataField] }
        //     : {}),
        // };

        return (
            <>
                <Table
                    columns={subTableConfig.columns}
                    dataSource={[record]} // Pass as single-item array since we're showing details
                    pagination={false}
                    rowKey={subTableConfig.rowKey || "id"}
                    components={{
                        header: {
                            cell: (props) => (
                                <th
                                    {...props}
                                    style={{
                                        backgroundColor: "#FFF7ED",
                                        fontFamily: "Inter",
                                        fontWeight: 500,
                                        fontSize: "14px",
                                        color: headingTextColor,
                                        letterSpacing: "0.014em",
                                        padding: "12px",
                                    }}
                                />
                            ),
                        },
                        body: {
                            cell: (props) => (
                                <td
                                    {...props}
                                    style={{
                                        fontSize: "12px", // Change text size
                                        fontFamily: "Inter",
                                        padding: "12px",
                                    }}
                                />
                            ),
                        },
                    }}
                />
                {
                    subTableConfig.columns_second_level?.length > 0 && (
                        <Table
                            columns={subTableConfig.columns_second_level}
                            dataSource={[record]} // Pass as single-item array since we're showing details
                            pagination={false}
                            rowKey={subTableConfig.rowKey || "id"}
                            components={{
                                header: {
                                    cell: (props) => (
                                        <th
                                            {...props}
                                            style={{
                                                backgroundColor: "#FFF7ED",
                                                fontFamily: "Inter",
                                                fontWeight: 500,
                                                fontSize: "14px",
                                                color: headingTextColor,
                                                letterSpacing: "0.014em",
                                                padding: "12px",
                                            }}
                                        />
                                    ),
                                },
                                body: {
                                    cell: (props) => (
                                        <td
                                            {...props}
                                            style={{
                                                fontSize: "12px", // Change text size
                                                fontFamily: "Inter",
                                                padding: "12px",
                                            }}
                                        />
                                    ),
                                },
                            }}
                        />
                    )
                }
            </>
        );
    };

    // Create skeleton loader for the table
    const renderSkeleton = () => {
        const skeletonRows = Array(currentPageSize)
            .fill(null)
            .map((_, index) => ({
                key: `skeleton-${index}`,
                isSkeletonRow: true,
            }));

        // Custom render function for skeleton columns
        const skeletonColumns = enhancedColumns.map((col) => ({
            ...col,
            render: (text, record) => {
                if (record.isSkeletonRow) {
                    return (
                        <Skeleton.Button
                            active
                            style={{ width: "100%", height: 20 }}
                            size="small"
                        />
                    );
                }
                return col.render ? col.render(text, record) : text;
            },
        }));

        return (
            <Table
                columns={skeletonColumns}
                dataSource={skeletonRows}
                pagination={false}
                rowKey="key"
                style={{
                    borderRadius: "8px",
                    border: "1px solid #dde1e6",
                    minWidth: "100%",
                    ...tableStyle,
                }}
                components={{
                    header: {
                        cell: (props) => (
                            <th
                                {...props}
                                style={{
                                    backgroundColor: headingBgColor,
                                    fontFamily: "Inter",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    color: headingTextColor,
                                    letterSpacing: "0.014em",
                                    padding: "12px",
                                }}
                            />
                        ),
                    },
                    body: {
                        cell: (props) => (
                            <td
                                {...props}
                                style={{
                                    fontSize: "12px",
                                    fontFamily: "Inter",
                                    color: "#333",
                                    padding: "12px",
                                }}
                            />
                        ),
                    },
                }}
            />
        );
    };

    return (
        <div className="flex flex-col flex-grow">
            <div className="flex flex-col flex-grow w-full overflow-x-auto">
                {loading || isFetchingData ? (
                    renderSkeleton()
                ) : (
                    <Table
                        columns={enhancedColumns}
                        dataSource={data}
                        rowKey={rowKey}
                        loading={false} // We're handling loading state with Skeleton
                        onChange={handleTableChange}
                        pagination={false} // Disable built-in pagination
                        expandable={
                            hasSubTable
                                ? {
                                    expandedRowRender,
                                    // expandRowByClick: true,
                                    expandRowByClick: false,
                                    expandIcon: ({ expanded, onExpand, record }) => (
                                        <CustomExpandIcon
                                            expanded={expanded}
                                            onExpand={onExpand}
                                            record={record}
                                        />
                                    ),
                                }
                                : undefined
                        }
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                            borderRadius: "8px",
                            border: "1px solid #dde1e6",
                            minWidth: "100%",
                            ...tableStyle,
                        }}
                        components={{
                            header: {
                                cell: (props) => (
                                    <th
                                        {...props}
                                        style={{
                                            backgroundColor: '#FAFAFA',
                                            fontFamily: "roboto",
                                            fontWeight: 600,
                                            fontSize: "14px",
                                            color: headingTextColor,
                                            letterSpacing: "0.014em",
                                            paddingTop: "11px",
                                            paddingBottom: "11px",
                                            paddingLeft: "15px",
                                            paddingRight: "15px",
                                            borderTop: "1px solid #E6E7EC",
                                            borderBottom: "1px solid #E6E7EC",
                                            borderBottom: "1px solid #E6E7EC",
                                        }}
                                    />
                                ),
                            },
                            body: {
                                cell: (props) => (
                                    <td
                                        {...props}
                                        style={{
                                            backgroundColor: '#FFFFFF',
                                            fontSize: "14px", // Change text size
                                            fontFamily: "roboto",
                                            color: "#5C5F6A", // Adjust text color if needed
                                            paddingTop: "11px",
                                            paddingBottom: "11px",
                                            paddingLeft: "15px",
                                            paddingRight: "15px",
                                            fontWeight: 400,
                                        }}
                                    />
                                ),
                            },
                        }}
                    />
                )}
            </div>
            {/* Render Pagination outside the table */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "16px", // Adjust margin as needed
                }}
            >
                <Pagination
                    current={currentPage}
                    pageSize={currentPageSize}
                    total={totalItems}
                    onChange={handlePaginationChange}
                    showSizeChanger={false} // Optional: Enable size changer
                />

            </div>
        </div>
    );
};

export default DataTable;