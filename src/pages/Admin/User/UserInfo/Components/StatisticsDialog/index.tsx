"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/Atoms/ui/dialog";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@components/Atoms/ui/chart";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import { USER } from "@constants/user";
import userService from "@services/user";
import { IUserDemographicsStatsData } from "@models/user/response";
import { TrendingUp, Loader2 } from "lucide-react";

interface StatisticsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    birthdayAndGenderStats: any;
}

const COLORS = {
    MALE: "#3b82f6",
    FEMALE: "#ec4899",
    OTHER: "#8b5cf6",
};

const AGE_GROUP_COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#8dd1e1",
];

const StatisticsDialog = ({ open, onOpenChange, birthdayAndGenderStats }: StatisticsDialogProps) => {
    const [stats, setStats] = useState<any>(birthdayAndGenderStats);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            fetchStats();
        }
    }, [open]);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const response = await userService.getUserDemographicsStats();
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching demographics stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getGenderLabel = (genderKey: string) => {
        switch (genderKey) {
            case "male":
                return "Nam";
            case "female":
                return "Nữ";
            case "other":
                return "Khác";
            default:
                return genderKey;
        }
    };

    // Transform data for charts - Convert object to array
    const genderChartData = useMemo(() => {
        if (!stats?.genders) return [];
        return Object.entries(stats.genders).map(([key, value]: [string, any]) => ({
            name: getGenderLabel(key),
            value: value.amount,
            percentage: value.percent,
            genderKey: key,
        }));
    }, [stats]);

    const ageChartData = useMemo(() => {
        if (!stats?.ages) return [];
        return Object.entries(stats.ages).map(([ageRange, value]: [string, any]) => ({
            name: ageRange,
            value: value.amount,
            percent: value.percent,
        }));
    }, [stats]);

    // Calculate total users
    const totalUsers = useMemo(() => {
        if (!stats?.genders) return 0;
        return Object.values(stats.genders).reduce((sum: number, item: any) => sum + item.amount, 0);
    }, [stats]);

    const RADIAN = Math.PI / 180;
    const renderCustomLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize={14}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-6 w-6" />
                        Thống kê người dùng
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : stats ? (
                    <div className="space-y-6">
                        {/* Total users card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Tổng số người dùng
                                    </p>
                                    <p className="text-3xl font-bold text-blue-700 mt-1">
                                        {totalUsers.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <TrendingUp className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Gender Chart */}
                            <div className="space-y-4 bg-white p-4 rounded-lg border">
                                <h3 className="text-lg font-semibold text-center">
                                    Phân bố giới tính
                                </h3>

                                <ChartContainer
                                    config={{
                                        count: {
                                            label: "Số lượng",
                                            color: "hsl(var(--chart-1))",
                                        },
                                    }}
                                    className="h-[280px] w-full "
                                >
                                    <PieChart>
                                        <Pie
                                            data={genderChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomLabel}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {genderChartData.map((entry, index) => {
                                                const genderKey = entry.genderKey || "";
                                                return (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[genderKey.toUpperCase() as keyof typeof COLORS] ||
                                                            "#8884d8"
                                                        }
                                                    />
                                                );
                                            })}
                                        </Pie>
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0];
                                                    return (
                                                        <div className="rounded-lg border bg-white p-3 shadow-lg">
                                                            <div className="grid gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="h-3 w-3 rounded-full"
                                                                        style={{
                                                                            backgroundColor: data.payload.fill,
                                                                        }}
                                                                    />
                                                                    <span className="font-medium">
                                                                        {data.payload.name}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Số lượng:{" "}
                                                                    <span className="font-semibold text-foreground">
                                                                        {data.value?.toLocaleString()}
                                                                    </span>
                                                                    {" "}người
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Tỷ lệ:{" "}
                                                                    <span className="font-semibold text-foreground">
                                                                        {data.payload.percentage}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ChartContainer>

                                {/* Gender Legend */}
                                <div className="grid grid-cols-1 gap-2 mt-4">
                                    {genderChartData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            COLORS[item.genderKey.toUpperCase() as keyof typeof COLORS],
                                                    }}
                                                />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {item.value.toLocaleString()} người ({item.percentage.toFixed(1)}%)
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Age Group Chart */}
                            <div className="space-y-4 bg-white p-4 rounded-lg border">
                                <h3 className="text-lg font-semibold text-center">
                                    Phân bố độ tuổi
                                </h3>

                                <ChartContainer
                                    config={{
                                        count: {
                                            label: "Số lượng",
                                            color: "hsl(var(--chart-2))",
                                        },
                                    }}
                                    className="h-[280px] w-full"
                                >
                                    <BarChart
                                        data={ageChartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 12 }}
                                            className="text-xs"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            className="text-xs"
                                        />
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0];
                                                    return (
                                                        <div className="rounded-lg border bg-white p-3 shadow-lg">
                                                            <div className="grid gap-2">
                                                                <div className="font-medium">
                                                                    {data.payload.name}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Số lượng:{" "}
                                                                    <span className="font-semibold text-foreground">
                                                                        {data.value?.toLocaleString()}
                                                                    </span>
                                                                    {" "}người
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[8, 8, 0, 0]}
                                        >
                                            {ageChartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={AGE_GROUP_COLORS[index % AGE_GROUP_COLORS.length]}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>

                                {/* Age Group Legend */}
                                <div className="grid grid-cols-1 gap-2 mt-4">
                                    {ageChartData.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-4 h-4 rounded"
                                                        style={{
                                                            backgroundColor:
                                                                AGE_GROUP_COLORS[index % AGE_GROUP_COLORS.length],
                                                        }}
                                                    />
                                                    <span className="font-medium">
                                                        {item.name} tuổi
                                                    </span>
                                                </div>
                                                <div className="text-sm font-semibold">
                                                    {item.value.toLocaleString()} người ({item.percent.toFixed(1)}%)
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                        Không có dữ liệu thống kê
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default StatisticsDialog;
