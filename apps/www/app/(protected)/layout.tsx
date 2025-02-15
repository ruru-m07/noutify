import Sidebar from "@/components/customs/sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex [--sidebar-width:4rem]">
      <Sidebar />
      {children}
    </div>
  );
}
