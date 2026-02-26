import { Sidebar } from "@/components/layout/sidebar";

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-20">{children}</div>
    </div>
  );
}
