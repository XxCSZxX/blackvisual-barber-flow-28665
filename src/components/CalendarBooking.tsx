import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarBookingProps {
  onBookingComplete: (date: Date, time: string) => void;
  onCancel: () => void;
}

const CalendarBooking = ({ onBookingComplete, onCancel }: CalendarBookingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Available time slots (can be configured)
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ];

  // Simulated blocked times (would come from backend)
  const blockedTimes = ["11:00", "15:00"];

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onBookingComplete(selectedDate, selectedTime);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-bold mb-4">Escolha a data</h3>
        <div className="flex justify-center bg-secondary rounded-2xl p-6 border border-border/50">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date.getDay() === 0}
            locale={ptBR}
            className={cn("pointer-events-auto")}
          />
        </div>
      </div>

      {selectedDate && (
        <div className="animate-fade-in">
          <h3 className="text-2xl font-bold mb-4">
            Horários disponíveis - {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {timeSlots.map((time) => {
              const isBlocked = blockedTimes.includes(time);
              const isSelected = selectedTime === time;

              return (
                <Button
                  key={time}
                  onClick={() => !isBlocked && setSelectedTime(time)}
                  disabled={isBlocked}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "font-bold rounded-xl py-6 transition-all",
                    isSelected && "bg-accent text-accent-foreground btn-3d scale-105",
                    !isSelected && !isBlocked && "hover:scale-105 hover:border-accent",
                    isBlocked && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {time}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-border hover:bg-secondary rounded-xl py-6"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/95 font-bold rounded-xl py-6 btn-3d disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  );
};

export default CalendarBooking;
