import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AdminPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function AdminPlaceholder({ icon: Icon, title, description }: AdminPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl mb-2 text-gray-700">Coming Soon</h3>
          <p className="text-gray-500 max-w-md">
            This feature is currently under development. It will be available in the next update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
