import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from "../ui/card";
import { StatCardProps } from '../../types/dashboardTypes';

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, trend, color = 'blue', changeText = 'vs last month', compact = false }) => {
    const isPositive = trend >= 0;
    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-500' },
        green: { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-500' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'text-purple-500' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-500' },
    };
    const currentColor = colorClasses[color] || colorClasses.blue;

    return (
        <Card className={compact ? '' : 'hover:shadow-md transition-shadow'}>
            <CardContent className={`p-${compact ? '4' : '6'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className={`text-sm font-medium ${compact ? 'text-gray-500' : currentColor.text}`}>
                            {title}
                        </p>
                        <p className={`text-${compact ? 'xl' : '2xl'} font-bold mt-1`}>{value}</p>
                    </div>
                    <div className={`p-${compact ? '2' : '3'} rounded-lg ${currentColor.bg}`}>
                        <Icon className={`${currentColor.icon}`} size={compact ? 18 : 20} />
                    </div>
                </div>
                <div className={`mt-3 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-medium">
                        {Math.abs(trend)}%
                    </span>
                    <span className="ml-1 text-gray-500">{changeText}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;