-- Adicionar constraint única para evitar reservas duplicadas no mesmo horário/data/barbeiro
ALTER TABLE bookings ADD CONSTRAINT unique_booking_slot 
UNIQUE (booking_date, booking_time, barber_id);