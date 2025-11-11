import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import { AdminLayout } from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Classes from "./pages/admin/Classes";
import Programs from "./pages/admin/Programs";
import Templates from "./pages/admin/Templates";
import Coaches from "./pages/admin/Coaches";
import Events from "./pages/admin/Events";
import Packages from "./pages/admin/Packages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="classes" element={<Classes />} />
            <Route path="programs" element={<Programs />} />
            <Route path="templates" element={<Templates />} />
            <Route path="coaches" element={<Coaches />} />
            <Route path="events" element={<Events />} />
            <Route path="packages" element={<Packages />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
