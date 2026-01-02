import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getTimeSlotsForBarber, getBookedTimes } from "@/lib/supabase-helpers";

interface CalendarBookingProps {
  onBookingComplete: (date: Date, time: string, endTime?: string) => void;
  onCancel: () => void;
  barberId?: string;
  durationSlots?: number;
}

const CalendarBooking = ({ onBookingComplete, onCancel, barberId, durationSlots = 1 }: CalendarBookingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  useEffect(() => {
    if (barberId) {
      loadTimeSlots();
    }
  }, [barberId]);

  useEffect(() => {
    if (selectedDate && barberId) {
      loadBlockedTimes(selectedDate);
    }
  }, [selectedDate, barberId]);

  const loadTimeSlots = async () => {
    if (!barberId) return;
    
    const { data } = await getTimeSlotsForBarber(barberId);

    if (data) {
      setTimeSlots(data.map((slot: any) => slot.time));
    }
  };

  const loadBlockedTimes = async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const { data } = await getBookedTimes(dateStr, barberId);

    if (data) {
      setBlockedTimes(data.map((booking) => booking.booking_time));
    }
  };

  // Calculate end time based on duration slots (each slot = 30 min)
  const getEndTime = (startTime: string, slots: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + (slots * 30);
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
  };

  // Get consecutive time slots starting from a given time
  const getConsecutiveSlots = (startTime: string, count: number): string[] => {
    const startIndex = timeSlots.indexOf(startTime);
    if (startIndex === -1) return [];
    
    const slots: string[] = [];
    for (let i = 0; i < count; i++) {
      if (startIndex + i < timeSlots.length) {
        slots.push(timeSlots[startIndex + i]);
      }
    }
    return slots;
  };

  // Check if a time slot can be selected (has enough consecutive available slots)
  const canSelectTime = (time: string): boolean => {
    const consecutiveSlots = getConsecutiveSlots(time, durationSlots);
    
    // Need exactly durationSlots consecutive slots
    if (consecutiveSlots.length < durationSlots) return false;
    
    // None of the required slots can be blocked
    return !consecutiveSlots.some(slot => blockedTimes.includes(slot));
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const endTime = durationSlots > 1 ? getEndTime(selectedTime, durationSlots) : undefined;
      onBookingComplete(selectedDate, selectedTime, endTime);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Escolha a data</h3>
        <div className="flex justify-center bg-secondary rounded-2xl p-3 md:p-6 border border-border/50">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date.getDay() === 0}
            locale={ptBR}
            className={cn("pointer-events-auto scale-90 md:scale-100")}
          />
        </div>
      </div>

      {selectedDate && (
        <div className="animate-fade-in space-y-3 md:space-y-4">
          <h3 className="text-lg md:text-2xl font-bold">
            Horários - {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
            {durationSlots > 1 && <span className="text-sm font-normal text-muted-foreground ml-2">(duração: {durationSlots * 30}min)</span>}
          </h3>
          {timeSlots.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Este barbeiro não tem horários configurados.
            </p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
              {timeSlots.map((time) => {
                const isBlocked = blockedTimes.includes(time);
                const isSelected = selectedTime === time;
                const canSelect = canSelectTime(time);
                const endTime = getEndTime(time, durationSlots);

                return (
                  <Button
                    key={time}
                    onClick={() => canSelect && setSelectedTime(time)}
                    disabled={!canSelect}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "font-bold rounded-lg md:rounded-xl py-4 md:py-6 text-sm md:text-base transition-all flex flex-col",
                      isSelected && "bg-accent text-accent-foreground btn-3d scale-105",
                      !isSelected && canSelect && "hover:scale-105 hover:border-accent",
                      !canSelect && "opacity-30 cursor-not-allowed"
                    )}
                  >
                    <span>{time}</span>
                    {durationSlots > 1 && isSelected && (
                      <span className="text-xs opacity-80">até {endTime}</span>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 md:gap-4 pt-2 sticky bottom-0 bg-card pb-2">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-border hover:bg-secondary rounded-xl py-5 md:py-6 text-sm md:text-base font-semibold"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/95 font-bold rounded-xl py-5 md:py-6 text-sm md:text-base btn-3d disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  );
};

export default CalendarBooking;
