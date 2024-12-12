import axios from "axios";
import { useUser } from "../contexts/UserContexts";

const API_URL = "http://localhost:8080/api";

interface LoginRequest {
  username: string;
  password: string;
}

export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events", error);
    throw error;
  }
};

export const saveEvent = async (eventData: any) => {
  try {
    const response = await axios.post(`${API_URL}/events`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error saving event", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: number | undefined) => {
  try {
    const response = await axios.delete(`${API_URL}/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error saving event", error);
    throw error;
  }
};

export const updateEventStatus = async (
  eventId: number | undefined,
  eventStarted: boolean | undefined
) => {
  if (!eventId) return;

  try {
    const response = await axios.put(
      `${API_URL}/events/changeStatus/${eventId}`,
      {
        status: !eventStarted,
      }
    );
    console.log("Event updated:", response.data);
  } catch (error) {
    console.error("Failed to update event:", error);
  }
};

export const handleLogin = async (
  username: string,
  password: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const loginRequest: LoginRequest = { username, password };

  try {
    setIsLoading(true);
    setErrorMessage("");

    const response = await axios.post(`${API_URL}/auth/login`, loginRequest);

    return response;
  } catch (error) {
    setErrorMessage("Invalid username or password");
    console.error("Login failed", error);
  } finally {
    setIsLoading(false);
  }
};

export const buyTickets = async (
  eventId: number,
  customerName: string,
  count: number
) => {
  try {
    const response = await axios.post(`${API_URL}/customer/buy-ticket`, {
      eventId,
      count,
      name: customerName,
    });

    console.log("Tickets purchased successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to purchase tickets:", error);

    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error("Event not found.");
      } else if (error.response.status === 500) {
        throw new Error("Internal server error occurred.");
      }
    }

    throw new Error("Failed to purchase tickets.");
  }
};

export const addTickets = async (
  eventId: number | undefined,
  count: number,
  price: number
) => {
  if (!eventId) {
    throw new Error("Event id can't be empty");
  }
  try {
    const response = await axios.post(`${API_URL}/vendor/add-tickets`, {
      eventId,
      count,
      price,
    });

    console.log("Tickets purchased successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to purchase tickets:", error);

    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error("Event not found.");
      } else if (error.response.status === 500) {
        throw new Error("Internal server error occurred.");
      }
    }

    throw new Error("Failed to purchase tickets.");
  }
};
