import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
} from "recharts";
import { formatPrice } from "../../../utils/common";

interface EarningsBarChartProps {
    data: Array<{ name: string; earnings: number }>;
    height?: number;
    barColor?: string;
    referenceLineColor?: string;
}

const EarningsBarChart: React.FC<EarningsBarChartProps> = ({
    data,
    height = 300,
    barColor = "#f87171",
    referenceLineColor = "#0f766e",
}) => {
    // Compute average
    const total = data.reduce((sum, d) => sum + d.earnings, 0);
    const avg = Math.round(total / data.length);

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
                <XAxis dataKey="name" />
                <Tooltip />
                <ReferenceLine
                    y={avg}
                    stroke={referenceLineColor}
                    strokeDasharray="4 2"
                    label={{
                        value: formatPrice(avg) + ' AVG',
                        position: "insideTopRight",
                        fill: referenceLineColor,
                        fontSize: 12,
                    }}
                />
                <Bar dataKey="earnings" fill={barColor} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default EarningsBarChart; 