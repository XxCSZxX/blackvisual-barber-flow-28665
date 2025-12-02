import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getUserRoles } from "@/lib/supabase-helpers";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let mounted = true;

    const redirectByRole = async (userId: string) => {
      const { data: roles } = await getUserRoles(userId);
      const isAdmin = roles?.some(r => r.role === "admin") ?? false;
      navigate(isAdmin ? "/admin" : "/");
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted || !session) return;
      redirectByRole(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) return;
      redirectByRole(session.user.id);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Login realizado com sucesso!");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await getUserRoles(session.user.id);
        const isAdmin = roles?.some(r => r.role === "admin") ?? false;
        navigate(isAdmin ? "/admin" : "/");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-3xl border border-border/50">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">Cruvinel's Barbearia</h1>
          <p className="text-muted-foreground">Acesso administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-secondary"
            />
          </div>

          <Button
            type="submit"
            className="w-full btn-3d"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Voltar para o site
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;