import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  FileText,
  Users,
  Zap,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Classes", url: "/admin/classes", icon: Calendar },
  { title: "Programs", url: "/admin/programs", icon: BookOpen },
  { title: "Templates", url: "/admin/templates", icon: FileText },
  { title: "Coaches", url: "/admin/coaches", icon: Users },
  { title: "Events", url: "/admin/events", icon: Zap },
  { title: "Packages", url: "/admin/packages", icon: ShoppingCart },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const handleSignOut = async () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <div className="p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl">
              AC
            </div>
            <div>
              <div className="font-bold">Admin Panel</div>
              <div className="text-xs text-muted-foreground">Athleland</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl mx-auto">
            AC
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
