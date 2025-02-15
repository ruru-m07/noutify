import Sidebar from "@/components/customs/sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex [--sidebar-width:4rem]">
      <Sidebar />
      <div className="[--margin:0.7rem] [--inbox-width:23rem] [--top-nav-height:3rem] m-[var(--margin)] bg-accent/35 border w-full h-[calc(100vh-var(--margin)*2)] rounded-md overflow-hidden flex">
        {children}
      </div>
    </div>
  );
}
