import { DashboardLayoutWrapper } from "@/components/layout/dashboard-layout-wrapper";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
