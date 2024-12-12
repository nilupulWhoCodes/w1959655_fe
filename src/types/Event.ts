export interface Event {
  id: number;
  startTime: string;
  name: string;
  photoUrl: string;

  location: string;
  configuration: Configuration;

  eventStarted: boolean;
  tickets: Ticket[];
}

export interface Configuration {
  id: number;
  totalNumberOfTickets: number;
  maximumPoolCapacity: number;
  ticketReleaseRate: number;
  customerRetrievalRate: number;
}

export interface Ticket {
  id: number;
  price: number;
  sold: boolean;
}
