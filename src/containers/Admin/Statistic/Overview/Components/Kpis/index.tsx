import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Atoms/ui/card";
import LucideIcon from "@/components/Atoms/LucideIcon";

export interface KpiItem {
  title: string;
  value: string;
  change: string;
  icon: string;
}

interface Props {
  items: KpiItem[];
}

const Kpis = ({ items }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items?.map((k) => (
        <Card key={k.title} className="border-gray-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {k.title}
              </CardTitle>
              <LucideIcon
                name={k.icon as any}
                iconSize={18}
                className="text-muted-foreground"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{k.value}</div>
            <CardDescription className="mt-1 text-xs text-gray-500">
              {k.change}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Kpis;
