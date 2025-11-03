import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessCheckProps {
  isVisible: boolean;
  onComplete: () => void;
}

const SuccessCheck = ({ isVisible, onComplete }: SuccessCheckProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-fade-in">
      <div className="text-center space-y-4 animate-scale-in">
        <div className="relative mx-auto w-32 h-32">
          <CheckCircle2 className="w-32 h-32 text-green-500 animate-check-draw" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-foreground">Agendamento confirmado!</h2>
        <p className="text-muted-foreground">Você será redirecionado em instantes...</p>
      </div>
    </div>
  );
};

export default SuccessCheck;
