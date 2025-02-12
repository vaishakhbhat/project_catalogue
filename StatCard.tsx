import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface StatCardProps {
    icon: IconDefinition;
    title: string;
    total: string;
    active: string;
    inactive: string;
    children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, total, active, inactive }) => {
    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="text-3xl mr-4">
                        <FontAwesomeIcon icon={icon} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold " style={{ color: '#0f3374' }}>{title}</h4>
                        <p className="font-semibold" style={{ color: '#000000' }}>{total}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm">
                        <p className="text-green-600">{active}</p>
                        <p className="text-red-600">{inactive}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
