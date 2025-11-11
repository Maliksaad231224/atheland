import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, BookOpen, FileText, Users, Zap, ShoppingCart } from "lucide-react";

interface Stats {
  totalClasses: number;
  totalPrograms: number;
  totalTemplates: number;
  totalEnrollments: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalClasses: 0,
    totalPrograms: 0,
    totalTemplates: 0,
    totalEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [classes, programs, templates, enrollments] = await Promise.all([
        supabase.from("classes").select("id", { count: "exact", head: true }),
        supabase.from("programs").select("id", { count: "exact", head: true }),
        supabase.from("workout_templates").select("id", { count: "exact", head: true }),
        supabase.from("class_enrollments").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalClasses: classes.count || 0,
        totalPrograms: programs.count || 0,
        totalTemplates: templates.count || 0,
        totalEnrollments: enrollments.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Total Programs",
      value: stats.totalPrograms,
      icon: BookOpen,
      color: "text-accent",
    },
    {
      title: "Templates",
      value: stats.totalTemplates,
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Total Enrollments",
      value: stats.totalEnrollments,
      icon: Users,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of Athleland Conditioning Club management
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? "..." : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/classes"
              className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <div className="font-semibold mb-1">Manage Classes</div>
              <div className="text-sm text-muted-foreground">
                Create and schedule new classes
              </div>
            </a>
            <a
              href="/admin/programs"
              className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <div className="font-semibold mb-1">Manage Programs</div>
              <div className="text-sm text-muted-foreground">
                Create multi-week training programs
              </div>
            </a>
            <a
              href="/admin/templates"
              className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <div className="font-semibold mb-1">Manage Templates</div>
              <div className="text-sm text-muted-foreground">
                Create workout templates with blocks
              </div>
            </a>
            <a
              href="/admin/coaches"
              className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <div className="font-semibold mb-1">Manage Coaches</div>
              <div className="text-sm text-muted-foreground">
                Add and manage coaching staff
              </div>
            </a>
            <a
              href="/admin/events"
              className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <div className="font-semibold mb-1">Manage Events</div>
              <div className="text-sm text-muted-foreground">
                Create and schedule special events
              </div>
            </a>
            <a
              href="/admin/packages"
              className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <div className="font-semibold mb-1">Manage Packages</div>
              <div className="text-sm text-muted-foreground">
                Create and manage membership packages
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to display
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
