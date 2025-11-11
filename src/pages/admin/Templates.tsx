import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateTemplateDialog } from "@/components/admin/CreateTemplateDialog";

interface Template {
  id: string;
  name: string;
  description: string;
  template_type: string;
  category: string;
}

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("workout_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "HIIT":
        return "bg-accent text-accent-foreground";
      case "STRENGTH":
        return "bg-primary text-primary-foreground";
      case "CARDIO":
        return "bg-intensity-medium text-white";
      case "HYROX":
        return "bg-intensity-high text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Templates Management</h1>
          <p className="text-muted-foreground">
            Create and manage workout templates with blocks and exercises
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2" size={18} />
          Create Template
        </Button>
      </div>

      <CreateTemplateDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditingTemplateId(null);
        }}
        onSuccess={fetchTemplates}
        editingTemplateId={editingTemplateId}
      />

      {loading ? (
        <div className="text-center py-12">Loading templates...</div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No templates found</p>
              <p className="text-sm">Create your first template to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="hover-scale">
              <CardHeader>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getTypeColor(template.template_type)}>
                    {template.template_type}
                  </Badge>
                  {template.category && (
                    <Badge variant="outline">{template.category}</Badge>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingTemplateId(template.id); setCreateDialogOpen(true); }}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;
