import React, { useState, useEffect, useMemo } from 'react';
import { historicalData, getFilteredData } from '../data/mockData';
import { BudgetVsActualChart } from './BudgetVsActualChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import type { HistoricalData, CostCenter, BudgetVsActualData } from '../types';


const StatCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => {
    const isIncrease = changeType === 'increase';
    const changeColor = isIncrease ? 'text-red-500' : 'text-green-500';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
            {change && (
                 <p className={`mt-2 text-sm ${changeColor}`}>
                    <span className="font-semibold">{isIncrease ? '▲' : '▼'} {change}</span> do Orçamento
                 </p>
            )}
        </div>
    );
};

const HistoricalChart: React.FC<{data: HistoricalData[]}> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 30,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="month" tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `R$${Number(value) / 1000}k`} tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} />
                <Tooltip 
                    cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                    contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.8)',
                        borderColor: 'rgb(55 65 81)',
                        color: '#fff'
                    }}
                    formatter={(value: number) => `R$${value.toLocaleString()}`}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line 
                    type="monotone" 
                    dataKey="spent" 
                    name="Gasto Total" 
                    stroke="#1d4ed8" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }}
                    label={({ x, y, value }) => (
                         <text x={x} y={y} dy={-6} fill="#6b7280" fontSize={10} textAnchor="middle">
                            {`R$${(value / 1000).toFixed(0)}k`}
                        </text>
                    )}
                />
                <Brush dataKey="month" height={30} stroke="#1d4ed8" />
            </LineChart>
        </ResponsiveContainer>
    )
}

interface DashboardProps {
    costCenters: CostCenter[];
}

export const Dashboard: React.FC<DashboardProps> = ({ costCenters }) => {
    const [period, setPeriod] = useState('this_year');

    const { 
        historicalData: filteredHistoricalData,
        budgetVsActualData 
    } = useMemo(() => getFilteredData(period, costCenters), [period, costCenters]);

    const totalBudget = budgetVsActualData.reduce((sum, cc) => sum + cc.budget, 0);
    const totalSpent = budgetVsActualData.reduce((sum, cc) => sum + cc.actual, 0);
    const totalVariance = totalBudget - totalSpent;
    const spentPercentage = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(2) : '0.00';

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);


    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Visão Geral do Dashboard</h1>
                 <div className="flex items-center gap-4 bg-white dark:bg-gray-800/50 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <label htmlFor="period-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Período:
                    </label>
                    <select
                        id="period-filter"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    >
                        <option value="this_year">Este Ano</option>
                        <option value="last_6_months">Últimos 6 Meses</option>
                        <option value="last_90_days">Últimos 90 Dias</option>
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Orçamento Total" 
                    value={`R$${(totalBudget / 1000).toFixed(1)}k`} 
                />
                <StatCard 
                    title="Total Gasto" 
                    value={`R$${(totalSpent / 1000).toFixed(1)}k`} 
                    change={`${spentPercentage}%`}
                    changeType={totalSpent > totalBudget ? 'increase' : 'decrease'}
                />
                <StatCard 
                    title="Variação" 
                    value={`R$${(totalVariance / 1000).toFixed(1)}k`} 
                    changeType={totalVariance > 0 ? 'decrease' : 'increase'}
                />
                 <StatCard 
                    title="Centros de Custo" 
                    value={costCenters.length.toString()} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Orçado vs. Realizado por Centro de Custo</h3>
                    <div className="h-96">
                        {isClient && <BudgetVsActualChart data={budgetVsActualData} />}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Desempenho Histórico Mensal</h3>
                    <div className="h-96">
                         {isClient && <HistoricalChart data={filteredHistoricalData}/>}
                    </div>
                </div>
            </div>
        </div>
    );
};