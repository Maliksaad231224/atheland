import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2 } from "lucide-react";

export function AdminLayout() {
  const { isAuthenticated, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border px-6">
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-6 bg-secondary/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
