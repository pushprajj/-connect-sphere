import DashboardNavbar from '@/components/DashboardNavbar';

interface DashboardNavWrapperProps {
  children: React.ReactNode;
}

export default function DashboardNavWrapper({ children }: DashboardNavWrapperProps) {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  );
}

