import { useEffect } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Event } from "../types/Event";

const SOCKET_URL = "http://localhost:8080/ws";

export const useEventWebSocket = (
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | undefined>>,
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
) => {
  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);

    const handleEventUpdate = (message: any) => {
      const updatedEvent: Event = JSON.parse(message.body);

      setSelectedEvent((prevEvent) =>
        prevEvent?.id === updatedEvent.id ? updatedEvent : prevEvent
      );

      setEvents((prevEvents) => {
        const existingEventIndex = prevEvents.findIndex(
          (event) => event.id === updatedEvent.id
        );

        if (existingEventIndex !== -1) {
          const updatedEvents = [...prevEvents];
          updatedEvents[existingEventIndex] = updatedEvent;
          return updatedEvents;
        }

        return [...prevEvents, updatedEvent];
      });
    };

    const handleEventDeletion = (message: any) => {
      const deletedEventId: number = Number(JSON.parse(message.body));

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== deletedEventId)
      );

      setSelectedEvent((prevEvent) =>
        prevEvent?.id === deletedEventId ? undefined : prevEvent
      );
    };

    stompClient.connect(
      {},
      () => {
        console.log("WebSocket connected!");

        stompClient.subscribe("/topic/eventStatus", handleEventUpdate);

        stompClient.subscribe("/topic/eventDeleted", handleEventDeletion);
      },
      (error: any) => {
        console.error("WebSocket connection error:", error);
      }
    );

    return () => {
      stompClient.disconnect(() => {
        console.log("WebSocket disconnected");
      });
    };
  }, [setSelectedEvent, setEvents]);
};
