"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/Atoms/ui/dialog";
import { Loader2, Activity } from "lucide-react";
import dashboardService from "@services/dashboard";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@components/Atoms/ui/chart";
import {
    LineChart,
    Line,
    CartesianGrid as LineCartesianGrid,
    XAxis as LineXAxis,
    YAxis as LineYAxis,
    Tooltip as LineTooltip,
} from "recharts";

interface MetricWithDisplay {
    value?: number;
    valueInMinutes?: number;
    displayValue?: string;
    title?: string;
    description?: string;
}

interface BehaviorRatios {
    value?: number;
    displayValue?: string;
    title?: string;
    description?: string;
}

interface UserEngagement {
    title?: string;
    dauWauRatio?: BehaviorRatios;
    wauMauRatio?: BehaviorRatios;
}

interface NewVsReturning {
    title?: string;
    newUsers?: { value?: number; title?: string };
    returningUsers?: { value?: number; title?: string };
    total?: number;
    newUserPercent?: number;
    returningUserPercent?: number;
}

interface EngagementCounts {
    dau?: number;
    wau?: number;
    mau?: number;
}

interface BehaviorStatsData {
    averageEngagementTime?: MetricWithDisplay;
    averageSessionDuration?: MetricWithDisplay;
    dauMauRatio?: BehaviorRatios;
    userEngagement?: UserEngagement;
    newVsReturning?: NewVsReturning;
    engagementData?: EngagementCounts;
}

interface BehaviorStatsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const StatCard = ({
    title,
    primary,
    secondary,
    description,
}: {
    title?: string;
    primary?: string;
    secondary?: string;
    description?: string;
}) => {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">{title ?? "--"}</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{primary ?? "--"}</p>
            {secondary ? (
                <p className="text-sm text-gray-600 mt-1">{secondary}</p>
            ) : null}
            {description ? (
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{description}</p>
            ) : null}
        </div>
    );
};

const BehaviorStatsDialog = ({ open, onOpenChange }: BehaviorStatsDialogProps) => {
    const [stats, setStats] = useState<BehaviorStatsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchStats();
        }
    }, [open]);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const response = (await dashboardService.getDasboardBehaviorStats()) as {
                data?: BehaviorStatsData;
            };
            if (response?.data) {
                setStats(response.data as BehaviorStatsData);
            }
        } catch (error) {
            console.error("Error fetching behavior stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalUsers = useMemo(() => {
        return stats?.newVsReturning?.total ?? 0;
    }, [stats]);

    const engagementLineData = useMemo(() => {
        if (!stats?.engagementData) return [];
        return [
            { name: "DAU", count: stats.engagementData.dau ?? 0 },
            { name: "WAU", count: stats.engagementData.wau ?? 0 },
            { name: "MAU", count: stats.engagementData.mau ?? 0 },
        ];
    }, [stats]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6" />
                        Thống kê hành vi người dùng
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : stats ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <StatCard
                                title={stats.averageEngagementTime?.title}
                                primary={stats.averageEngagementTime?.displayValue}
                                secondary={stats.averageEngagementTime?.valueInMinutes ? `${stats.averageEngagementTime.valueInMinutes.toFixed(2)} phút` : undefined}
                            />
                            <StatCard
                                title={stats.averageSessionDuration?.title}
                                primary={stats.averageSessionDuration?.displayValue}
                                secondary={stats.averageSessionDuration?.valueInMinutes ? `${stats.averageSessionDuration.valueInMinutes.toFixed(2)} phút` : undefined}
                            />
                            <StatCard
                                title={stats.dauMauRatio?.title}
                                primary={stats.dauMauRatio?.displayValue}
                                description={`DAU/MAU: ${stats.dauMauRatio?.displayValue ?? "--"}`}
                            />
                            <StatCard
                                title={stats.userEngagement?.title}
                                primary={`DAU/WAU: ${stats.userEngagement?.dauWauRatio?.displayValue ?? "--"}`}
                                secondary={`WAU/MAU: ${stats.userEngagement?.wauMauRatio?.displayValue ?? "--"}`}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="rounded-lg border bg-white p-5 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">
                                    {stats.newVsReturning?.title ?? "Người dùng mới vs quay lại"}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="rounded-md bg-green-50 border border-green-200 p-4">
                                        <p className="text-sm text-green-600 font-medium">
                                            {stats.newVsReturning?.newUsers?.title ?? "Người dùng mới"}
                                        </p>
                                        <p className="text-2xl font-semibold text-green-700 mt-1">
                                            {stats.newVsReturning?.newUsers?.value?.toLocaleString() ?? "--"}
                                        </p>
                                        <p className="text-sm text-green-600 mt-2">
                                            {stats.newVsReturning?.newUserPercent != null
                                                ? `${stats.newVsReturning.newUserPercent.toFixed(1)}%`
                                                : "--"}
                                        </p>
                                    </div>
                                    <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
                                        <p className="text-sm text-blue-600 font-medium">
                                            {stats.newVsReturning?.returningUsers?.title ?? "Người dùng quay lại"}
                                        </p>
                                        <p className="text-2xl font-semibold text-blue-700 mt-1">
                                            {stats.newVsReturning?.returningUsers?.value?.toLocaleString() ?? "--"}
                                        </p>
                                        <p className="text-sm text-blue-600 mt-2">
                                            {stats.newVsReturning?.returningUserPercent != null
                                                ? `${stats.newVsReturning.returningUserPercent.toFixed(1)}%`
                                                : "--"}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                                    <div className="rounded-md bg-muted/30 p-3">
                                        <p className="font-medium text-muted-foreground">Tổng</p>
                                        <p className="text-xl font-semibold text-foreground">
                                            {totalUsers.toLocaleString()} người
                                        </p>
                                    </div>
                                    <div className="rounded-md bg-muted/30 p-3">
                                        <p className="font-medium text-muted-foreground">Người dùng mới</p>
                                        <p className="text-xl font-semibold text-foreground">
                                            {stats.newVsReturning?.newUsers?.value?.toLocaleString() ?? "--"}
                                        </p>
                                    </div>
                                    <div className="rounded-md bg-muted/30 p-3">
                                        <p className="font-medium text-muted-foreground">Người dùng quay lại</p>
                                        <p className="text-xl font-semibold text-foreground">
                                            {stats.newVsReturning?.returningUsers?.value?.toLocaleString() ?? "--"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-white p-5 shadow-sm space-y-4">
                                <h3 className="text-lg font-semibold">Hoạt động người dùng</h3>
                                <ChartContainer
                                    config={{
                                        count: {
                                            label: "Số lượng",
                                            color: "hsl(var(--chart-3))",
                                        },
                                    }}
                                    className="h-[250px] w-full"
                                >
                                    <LineChart data={engagementLineData}>
                                        <LineCartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <LineXAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <LineYAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#f97316"
                                            strokeWidth={2}
                                            dot={{ r: 4, fill: "#fb923c", stroke: "#f97316", strokeWidth: 2 }}
                                            activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2, fill: "#fff7ed" }}
                                        />
                                    </LineChart>
                                </ChartContainer>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <StatCard title="DAU" primary={stats.engagementData?.dau?.toLocaleString()} />
                                    <StatCard title="WAU" primary={stats.engagementData?.wau?.toLocaleString()} />
                                    <StatCard title="MAU" primary={stats.engagementData?.mau?.toLocaleString()} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Biểu đồ hiển thị số lượng người dùng hoạt động hàng ngày (DAU), hàng tuần (WAU) và hàng tháng (MAU).
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                        Không có dữ liệu thống kê hành vi
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BehaviorStatsDialog;
