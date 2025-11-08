"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Atoms/ui/select";
import { Filter } from "lucide-react";
import { IRewardCode } from "@models/user-reward/response";

interface ToolbarProps {
    onCodeFilter: (value: string) => void;
    codeValue: string;
    giftCodes?: IRewardCode[];
}

const Toolbar: React.FC<ToolbarProps> = ({
    onCodeFilter,
    codeValue,
    giftCodes,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                {/* Code Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={codeValue} onValueChange={onCodeFilter}>
                        <SelectTrigger className="w-[200px] bg-background border-border text-foreground">
                            <SelectValue placeholder="Chọn mã code" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                            <SelectItem value="all">Tất cả mã code</SelectItem>
                            {giftCodes?.map((code) => (
                                <SelectItem key={code.id} value={code.code}>
                                    {code.name} ({code.code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
