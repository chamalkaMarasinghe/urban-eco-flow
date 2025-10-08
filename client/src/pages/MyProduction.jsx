import { useState } from "react";
import {ChevronDown} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const MyProduction = () => {
    // Sample data for the chart
    const chartData = [
        { date: "19th Feb", value: 1400 },
        { date: "20th Feb", value: 1100 },
        { date: "21st Feb", value: 2100 },
        { date: "Feb 22nd", value: 1800 },
        { date: "Feb 23rd", value: 1500 },
        { date: "Feb 24th", value: 1900 },
        { date: "Feb 25th", value: 1500 },
    ];

    // Hero Section Component
    const HeroSection = () => {
        return (
            <section className="py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            Monitor my waste production
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground">
                            Real-time data to help you reduce waste and costs.
                        </p>
                    </div>
                </div>
            </section>
        );
    };

    // Chart Section Component
    const ChartSection = () => {
        const [selectedPeriod, setSelectedPeriod] = useState("Past 7 days");

        return (
            <section className="bg-background py-8 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto bg-card rounded-lg shadow-md p-6 sm:p-8">
                        {/* Chart Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground">
                                Garbage levels
                            </h2>
                            <div className="relative">
                                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded hover:bg-accent transition-colors">
                                    <span className="text-foreground">
                                        {selectedPeriod}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="w-full h-64 sm:h-80 mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top: 5,
                                        right: 20,
                                        left: 0,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#02a807"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        stroke="hsl(var(--muted-foreground))"
                                        tick={{
                                            fill: "hsl(var(--muted-foreground))",
                                        }}
                                        style={{ fontSize: "12px" }}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        tick={{
                                            fill: "hsl(var(--muted-foreground))",
                                        }}
                                        style={{ fontSize: "12px" }}
                                        tickFormatter={(value) =>
                                            `${value / 1000}K`
                                        }
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "6px",
                                            color: "hsl(var(--card-foreground))",
                                        }}
                                        formatter={(value) => [
                                            `${value}`,
                                            "Level",
                                        ]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#02a807"
                                        strokeWidth={2}
                                        dot={{
                                            fill: "hsl(var(--primary))",
                                            r: 4,
                                        }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* See More Button */}
                        <div className="text-center">
                            <button className="px-8 py-3 bg-primary text-white rounded font-semibold hover:opacity-90 transition-opacity">
                                SEE MORE
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    // Main Page Layout
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <HeroSection />
            <ChartSection />
        </div>
    );
};

export default MyProduction;
