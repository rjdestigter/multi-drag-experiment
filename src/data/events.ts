export const events = [
  {
    id: "1",
    title: "Doctor's appointment",
    start: new Date(2023, 11, 4, 10, 0, 0),
    end: new Date(2023, 11, 4, 11, 0, 0),
  },
  {
    id: "2",
    title: "Meeting with clients",
    start: new Date(2023, 11, 6, 14, 0, 0),
    end: new Date(2023, 11, 6, 15, 0, 0),
  },
  {
    id: "3",
    title: "Team lunch",
    start: new Date(2023, 11, 8, 12, 0, 0),
    end: new Date(2023, 11, 8, 13, 0, 0),
  },
  // Add more events here...
];

export const eventsById = events.reduce((acc, event) => {
  acc[event.id] = event;
  return acc;
}, {} as AppointmentsById);

export type Appointment = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

type AppointmentsById = {
  [id: string]: Appointment;
};
