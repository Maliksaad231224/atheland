import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Package {
  id: string;
  name: string;
  price: number;
  duration_period: string;
  features: string;
  is_popular: boolean;
  is_available: boolean;
}

const Packages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [features, setFeatures] = useState<string[]>([""]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("price", { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const formEl = e.currentTarget as HTMLFormElement;
    const formData = new FormData(formEl);

    const name = formData.get("name") as string;
    const price = Number(formData.get("price")) || 0;
    const duration_period = formData.get("duration_period") as string;
    const is_popular = formData.get("is_popular") === "on";
    const is_available = formData.get("is_available") === "on";

    // Filter out empty features
    const validFeatures = features.filter((f) => f.trim().length > 0);

    if (!name) {
      toast({
        title: "Validation Error",
        description: "Package name is required",
        variant: "destructive",
      });
      return;
    }

    if (validFeatures.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one feature",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name,
      price,
      duration_period,
      features: validFeatures.join("\n"),
      is_popular,
      is_available,
    };

    try {
      await supabase.from("packages").insert(payload);
      toast({ title: "Success", description: "Package created successfully" });
      setCreateOpen(false);
      setFeatures([""]);
      fetchPackages();
    } catch (err) {
      console.error("Create package error", err);
      toast({ title: "Error", description: "Failed to create package", variant: "destructive" });
    }
  };

  const handleCloseDialog = () => {
    setCreateOpen(false);
    setFeatures([""]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Packages Management</h1>
          <p className="text-muted-foreground">
            Create and manage membership packages
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2" size={18} />
          Add New Package
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Package</DialogTitle>
            <DialogDescription>Create a new membership package with features</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePackage} className="space-y-4">
            {/* Package Name */}
            <div>
              <Label htmlFor="name">PACKAGE NAME *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Starter, Professional, Premium"
                required
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">PRICE</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="0"
                defaultValue="0"
                min="0"
                step="0.01"
              />
            </div>

            {/* Duration Period */}
            <div>
              <Label>DURATION</Label>
              <input type="hidden" name="duration_period" id="duration_period" defaultValue="per year" />
              <Select defaultValue="per year" onValueChange={(v) => {
                const input = document.getElementById("duration_period") as HTMLInputElement;
                if (input) input.value = v;
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per month">per month</SelectItem>
                  <SelectItem value="per quarter">per quarter</SelectItem>
                  <SelectItem value="per year">per year</SelectItem>
                  <SelectItem value="one time">one time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Features */}
            <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">FEATURES</Label>
              </div>

              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter feature"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFeature}
                className="w-full"
              >
                <Plus size={16} className="mr-2" />
                Add Feature
              </Button>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 bg-muted/30 p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <Checkbox id="is_popular" name="is_popular" />
                <Label htmlFor="is_popular" className="font-normal cursor-pointer">
                  Highlight as popular
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="is_available" name="is_available" defaultChecked />
                <Label htmlFor="is_available" className="font-normal cursor-pointer">
                  Available for purchase
                </Label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                Create Package
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-12">Loading packages...</div>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Plus className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No packages found</p>
              <p className="text-sm">Create your first package to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`hover-scale flex flex-col ${pkg.is_popular ? "ring-2 ring-amber-400 shadow-lg" : ""}`}>
              {pkg.is_popular && (
                <div className="bg-amber-400/10 px-4 py-2 flex items-center gap-2 border-b border-amber-200">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-700">Popular</span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold">${pkg.price.toFixed(2)}</span>
                  <span className="text-muted-foreground text-sm">{pkg.duration_period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  {pkg.features.split("\n").map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-2">
                  {pkg.is_available && (
                    <Badge className="bg-green-500/10 text-green-700 border-green-200">
                      Available for Purchase
                    </Badge>
                  )}
                  {!pkg.is_available && (
                    <Badge variant="secondary">Unavailable</Badge>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
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

export default Packages;
