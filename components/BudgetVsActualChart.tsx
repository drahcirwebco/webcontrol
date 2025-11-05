import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import type { BudgetVsActualData } from '../types';

interface BudgetVsActualChartProps {
    data: BudgetVsActualData[];
}

const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value } = props;
    
    if (value > 0) {
        return (
            <text x={x + width / 2} y={y} dy={-4} fill="#6b7280" fontSize={10} textAnchor="middle">
            {value > 999 ? `${(value / 1000).toFixed(0)}k` : value}
            </text>
        );
    }
    return null;
  };

export const BudgetVsActualChart: React.FC<BudgetVsActualChartProps> = ({ data }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div className="w-full h-full flex items-center justify-center">Carregando gráfico...</div>;
    }
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `R$${Number(value) / 1000}k`} tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} />
                <Tooltip 
                    cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                    contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                        borderColor: 'rgb(55 65 81)', // border-gray-600
                        color: '#fff'
                    }}
                    formatter={(value: number) => `R$${value.toLocaleString()}`}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="budget" name="Orçamento" fill="#1d4ed8">
                    <LabelList dataKey="budget" content={renderCustomizedLabel} />
                </Bar>
                <Bar dataKey="actual" name="Realizado" fill="#60a5fa">
                    <LabelList dataKey="actual" content={renderCustomizedLabel} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};