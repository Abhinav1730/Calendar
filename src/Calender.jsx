import React, { useState, useEffect } from "react";
import "./Calender.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState({});
  const [eventInput, setEventInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null); // For editing event
  const [searchKeyword, setSearchKeyword] = useState(""); // For search functionality

  // for localStorage to persist events between page refresh
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events"));
    if (storedEvents) {
      setEvents(storedEvents);
    }
  }, []);

  // Save events to localStorage when there are change
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div className="cell" key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();
      const isSelected = selectedDay === day;

      days.push(
        <div
          className={`cell ${isToday ? "today" : ""} ${
            isSelected ? "selected" : ""
          }`}
          key={day}
          onClick={() => {
            setSelectedDay(day);
            setSelectedDate(day); // Set selected date for event input
            setEditingEvent(null); // Reset editing event when selecting a new day
          }}
        >
          {day}
          {events[day] && events[day].length > 0 && (
            <ul>
              {events[day]
                .filter((event) =>
                  event.toLowerCase().includes(searchKeyword.toLowerCase())
                )
                .map((event, index) => (
                  <li key={index}>
                    {editingEvent === `${day}-${index}` ? (
                      <div>
                        <input
                          type="text"
                          value={event}
                          onChange={(e) => handleEventEditChange(e, day, index)}
                        />
                        <button onClick={() => handleEventEditSave(day, index)}>
                          Save
                        </button>
                        <button onClick={() => handleEventDelete(day, index)}>
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div>
                        {event}{" "}
                        <button
                          onClick={() => setEditingEvent(`${day}-${index}`)}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleEventDelete(day, index)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (eventInput && selectedDate) {
      const newEvents = {
        ...events,
        [selectedDate]: [...(events[selectedDate] || []), eventInput],
      };
      setEvents(newEvents); // Update event state
      setEventInput("");
      setSelectedDate(null);
    }
  };

  const handleEventEditChange = (e, day, index) => {
    const updatedEvent = e.target.value;
    const updatedEvents = { ...events };
    updatedEvents[day][index] = updatedEvent;
    setEvents(updatedEvents);
  };

  const handleEventEditSave = (day, index) => {
    setEditingEvent(null);
  };

  const handleEventDelete = (day, index) => {
    const updatedEvents = { ...events };
    updatedEvents[day].splice(index, 1);
    if (updatedEvents[day].length === 0) {
      delete updatedEvents[day];
    }
    setEvents(updatedEvents);
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>Previous</button>
        <h2>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div className="filter">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search events"
        />
      </div>

      <div className="days">
        <div className="day">Sun</div>
        <div className="day">Mon</div>
        <div className="day">Tue</div>
        <div className="day">Wed</div>
        <div className="day">Thu</div>
        <div className="day">Fri</div>
        <div className="day">Sat</div>
      </div>

      <div className="grid">{renderCalendar()}</div>

      {selectedDate && (
        <form onSubmit={handleEventSubmit}>
          <input
            type="text"
            value={eventInput}
            onChange={(e) => setEventInput(e.target.value)}
            placeholder={`Add event for ${selectedDate}`}
          />
          <button type="submit">Add Event</button>
        </form>
      )}
      <div className="side-panel">
        <h3>Events for {selectedDay}</h3>
        {events[selectedDay] && events[selectedDay].length > 0 ? (
          <ul>
            {events[selectedDay].map((event, index) => (
              <li key={index}>
                {event}
                <button onClick={() => handleEventDelete(selectedDay, index)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events for this day.</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
