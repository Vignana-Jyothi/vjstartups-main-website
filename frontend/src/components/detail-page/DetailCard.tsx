import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DetailCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
  iconColor?: string;
  iconBgGradient?: string;
}

export const DetailCard = ({ 
  icon: Icon, 
  title, 
  children, 
  className = '',
  iconColor = 'text-white',
  iconBgGradient = 'from-blue-500 to-blue-600'
}: DetailCardProps) => {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in-up ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
          <div className={`p-2 bg-gradient-to-r ${iconBgGradient} rounded-lg mr-3`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

interface DetailSidebarCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
  iconColor?: string;
  iconBgGradient?: string;
}

export const DetailSidebarCard = ({ 
  icon: Icon, 
  title, 
  children, 
  className = '',
  iconColor = 'text-white',
  iconBgGradient = 'from-blue-500 to-blue-600'
}: DetailSidebarCardProps) => {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
          <div className={`p-2 bg-gradient-to-r ${iconBgGradient} rounded-lg mr-3`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
