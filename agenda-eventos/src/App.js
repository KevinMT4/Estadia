import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/App.css';
import Calendar from './components/Calendar';
import Button from './components/Button';
import PlusIcon from './components/PlusIcon';
import Input from './components/Input';
import Textarea from './components/Textarea';
import Badge from './components/Badge';
import UserSelect from './components/UserSelect';
import { sendNotification } from './utils/notification';
import Swal from 'sweetalert2';

const users = [
  { id: 1, name: 'Usuario 1', email: 'usuario1@example.com' },
  { id: 2, name: 'Usuario 2', email: 'usuario2@example.com' },
  // Añadir más usuarios según sea necesario
];

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    }
  }, [navigate]);

  const handleDayClick = (day) => {
    Swal.fire({
      title: 'Agregar nuevo evento?',
      text: `Desea agregar un nuevo evento para el ${day.toLocaleDateString()}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedDate(day);
        setShowEventForm(true);
        setSelectedEvent(null); // Asegúrate de que no haya ningún evento seleccionado para crear un nuevo evento
      }
    });
  };

  const handleEventClick = (event) => {
    Swal.fire({
      title: 'Selecciona una opción',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Editar',
      denyButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedEvent(event);
        setSelectedUserIds(event.userIds);
        setShowEventForm(true);
      } else if (result.isDenied) {
        handleEventDelete(event);
      }
    });
  };

  const handleEventSave = (event) => {
    // Validación de fechas y horas
    const now = new Date();
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    if (startDate < now) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha no válida',
        text: 'La fecha de inicio no puede ser una fecha pasada.',
      });
      return;
    }

    if (endDate <= startDate) {
      Swal.fire({
        icon: 'error',
        title: 'Hora no válida',
        text: 'La hora de fin debe ser mayor que la hora de inicio.',
      });
      return;
    }

    const userNames = selectedUserIds.length > 0 
      ? selectedUserIds.map(userId => users.find(user => user.id === userId).name) 
      : ['Sin asignar'];

    const newEvent = { ...event, userIds: selectedUserIds, userNames };

    if (selectedEvent) {
      // Actualizar evento existente
      setEvents(events.map((e) => (e.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : e)));
    } else {
      // Crear nuevo evento
      setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    }
    setShowEventForm(false);
    setSelectedEvent(null); // Resetear el evento seleccionado
    setSelectedUserIds([]); // Resetear los usuarios seleccionados
    setSelectedDate(null); // Resetear la fecha seleccionada
  };

  const handleEventDelete = (event) => {
    setEvents(events.filter((e) => e.id !== event.id));
    setSelectedEvent(null);
    setShowEventForm(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Está seguro que desea cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        navigate('/');
      }
    });
  };

  useEffect(() => {
    // Chequear eventos y enviar notificaciones
    const interval = setInterval(() => {
      events.forEach(event => {
        const now = new Date();
        const eventDate = new Date(event.start);
        const diff = (eventDate - now) / (1000 * 60 * 60); // Diferencia en horas
        if (diff > 0 && diff < 24) {
          event.userIds.forEach(userId => {
            const user = users.find(user => user.id === userId);
            sendNotification(user.email, event);
          });
        }
      });
    }, 60000); // Chequear cada minuto
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mi Agenda Digital</h1>
          <div className="flex items-center">
            <Button className="button-nuevo-evento" onClick={() => { setShowEventForm(true); setSelectedEvent(null); }}>
              <PlusIcon className="plus-icon" />
              Nuevo evento
            </Button>
            <Button className="button-cerrar-sesion" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-1fr-300px gap-4 p-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <Calendar events={events} onDayClick={handleDayClick} onEventClick={handleEventClick} className="w-full h-[600px]" />
        </div>
        {showEventForm && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">{selectedEvent ? 'Editar evento' : 'Nuevo evento'}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                let startDate = e.target.date.value;
                if (!startDate && selectedDate) {
                  startDate = selectedDate.toISOString().slice(0, 10);
                }
                const startTime = e.target.startTime.value;
                const endTime = e.target.endTime.value;

                const newEvent = {
                  title: e.target.title.value,
                  start: new Date(`${startDate}T${startTime}`),
                  end: new Date(`${startDate}T${endTime}`),
                  description: e.target.description.value,
                  color: e.target.color.value,
                };
                handleEventSave(newEvent);
              }}
            >
              <div className="mb-4">
                <label htmlFor="title" className="block font-medium mb-1">
                  Título
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={selectedEvent?.title || ''}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block font-medium mb-1">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    defaultValue={selectedEvent?.start ? selectedEvent.start.toISOString().slice(0, 10) : selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="startTime" className="block font-medium mb-1">
                    Hora de inicio
                  </label>
                  <Input
                    type="time"
                    id="startTime"
                    name="startTime"
                    defaultValue={selectedEvent?.start ? new Date(selectedEvent.start).toISOString().slice(11, 16) : ''}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block font-medium mb-1">
                    Hora de fin
                  </label>
                  <Input
                    type="time"
                    id="endTime"
                    name="endTime"
                    defaultValue={selectedEvent?.end ? new Date(selectedEvent.end).toISOString().slice(11, 16) : ''}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block font-medium mb-1">
                  Descripción
                </label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedEvent?.description || ''}
                  className="w-full"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="color" className="block font-medium mb-1">
                  Color del evento
                </label>
                <Input
                  type="color"
                  id="color"
                  name="color"
                  defaultValue={selectedEvent?.color || '#cccccc'}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="userId" className="block font-medium mb-1">
                  Asignar a Usuario(s) (opcional)
                </label>
                <UserSelect id="userId" name="userId" users={users} defaultValue={selectedUserIds} className="w-full" onChange={setSelectedUserIds} />
              </div>
              <div className="flex justify-end gap-2">
                {selectedEvent && (
                  <Button variant="danger" onClick={() => handleEventDelete(selectedEvent)} className="button-eliminar">
                    Eliminar
                  </Button>
                )}
                <Button type="submit" className="button-guardar">
                  Guardar
                </Button>
                <Button onClick={() => setShowEventForm(false)} className="button-cancelar">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
        {!showEventForm && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Próximos eventos</h2>
              <Button className="button-ver" size="sm">
                Ver Todo
              </Button>
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-100 rounded-md p-4 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <Badge variant="outline" className="calendar-event-date">
                      {new Date(event.start).toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-gray-500 mb-2">
                    {new Date(event.start).toLocaleTimeString()} - {new Date(event.end).toLocaleTimeString()}
                  </p>
                  <p className="text-gray-500">{event.description}</p>
                  <p className="text-gray-500">Usuarios: {event.userNames.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
