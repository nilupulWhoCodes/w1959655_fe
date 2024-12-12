import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Event {
  id: number;
  eventStarted: boolean;
}

export const useEventUpdates = (url: string) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const client = new Client({
      brokerURL: `${url}/ws`,
      connectHeaders: {},
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      webSocketFactory: () => new SockJS(`${url}/ws`),
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");

      client.subscribe("/topic/events", (message) => {
        const updatedEvent: Event = JSON.parse(message.body);
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [url]);

  return events;
};
