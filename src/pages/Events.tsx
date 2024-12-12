import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { Modal, SnackbarOrigin } from "@mui/material";
import { Event } from "../types/Event";
import { useFormattedDateTime } from "../hooks/useFormattedDateTimeHook";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import EventIcon from "@mui/icons-material/Event";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../contexts/UserContexts";
import {
  addTickets,
  buyTickets,
  deleteEvent,
  getAllEvents,
  updateEventStatus,
} from "../consts/apiService";
import { useEventWebSocket } from "../config/SocketConfig";
import PlaceholderImg from "../assets/imgs/7084233.jpg";
import CustomSnackBar from "../components/CustomSnackBar";

const placeholderImage = PlaceholderImg;

interface State extends SnackbarOrigin {
  openSnack: boolean;
  severity: "success" | "error";
  message: string;
}

interface AddTicketsDto {
  ticketPrice: number;
  numberOfTickets: number;
}

const Events = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );

  const [imageSrc, setImageSrc] = useState(
    selectedEvent?.photoUrl || placeholderImage
  );

  const [events, setEvents] = useState<Event[]>([]);

  const { formattedDate, formattedTime } = useFormattedDateTime(
    selectedEvent?.startTime || new Date().toISOString()
  );

  const availableTickets =
    selectedEvent?.tickets?.filter((ticket) => !ticket.sold) || [];

  const handleMinusClick = () => {
    setFormData((prev) => ({
      ...prev,
      ticketAmount: Math.max(1, prev.ticketAmount - 1),
    }));
  };

  const handlePlusClick = () => {
    const selectedPrice = selectedEvent?.tickets
      ?.filter((ticket) => !ticket.sold)
      .at(-1)?.price;

    const availableTicketsAtPrice =
      selectedEvent?.tickets?.filter(
        (ticket) => !ticket.sold && ticket.price === selectedPrice
      ) || [];

    const maxAvailableTickets = availableTicketsAtPrice.length;

    setFormData((prev) => ({
      ...prev,
      ticketAmount: Math.min(prev.ticketAmount + 1, maxAvailableTickets),
    }));
  };

  const { user } = useUser();

  useEventWebSocket(setSelectedEvent, setEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventToDelete: Event) => {
    if (!eventToDelete?.id) return;

    try {
      await deleteEvent(eventToDelete.id);

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventToDelete.id)
      );

      setSelectedEvent((prevEvent) =>
        prevEvent?.id === eventToDelete.id ? undefined : prevEvent
      );

      setState({
        openSnack: true,
        vertical: "top",
        horizontal: "right",
        severity: "success",
        message: "Event deleted successfully!",
      });
    } catch (error) {
      console.error("Failed to delete event", error);
      setState({
        openSnack: true,
        vertical: "top",
        horizontal: "right",
        severity: "error",
        message: "An error occured!",
      });
    }
  };

  /**
   * Customer form start w1959655
   * Validations of the customer form
   */

  const [formData, setFormData] = useState({
    name: "",
    ticketAmount: 1,
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBuyClick = async (eventId?: number) => {
    if (!eventId) {
      console.error("No event selected");
      setState({
        openSnack: true,
        vertical: "top",
        horizontal: "right",
        severity: "error",
        message: "Event saved successfully!",
      });

      return;
    }

    if (validateForm()) {
      try {
        const tickets = await buyTickets(
          eventId,
          formData.name,
          formData.ticketAmount
        );
        handleClose();
        setFormData((prev) => ({
          ...prev,
          name: "",
          ticketAmount: 1,
        }));
        setState({
          openSnack: true,
          vertical: "top",
          horizontal: "right",
          severity: "success",
          message: `Successfully bought${formData.ticketAmount} tickets`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  /**
   * Customer FORM END
   */

  /* 
  Vendor form start
  */

  const [formDataVendor, setFormDataVendor] = useState<AddTicketsDto>({
    ticketPrice: 0,
    numberOfTickets: 0,
  });

  const [errorsVendor, setErrorsVendor] = useState<{ [key: string]: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (formDataVendor.ticketPrice <= 0)
      newErrors.ticketPrice = "Ticket price must be greater than 0.";
    if (formDataVendor.numberOfTickets <= 0)
      newErrors.numberOfTickets = "Number of tickets must be greater than 0.";
    if (
      selectedEvent?.configuration?.maximumPoolCapacity !== undefined &&
      formDataVendor.numberOfTickets >
        selectedEvent.configuration.maximumPoolCapacity
    ) {
      newErrors.numberOfTickets =
        "Number of tickets can't be higher than maximum pool capacity";
      if (
        selectedEvent?.configuration?.totalNumberOfTickets !== undefined &&
        formDataVendor.numberOfTickets >
          selectedEvent.configuration.maximumPoolCapacity
      ) {
        newErrors.numberOfTickets =
          "Number of tickets can't be higher than total number of tickets";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (eventId: number) => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrorsVendor(validationErrors);
      return;
    }

    try {
      await addTickets(
        eventId,
        formDataVendor.numberOfTickets,
        formDataVendor.ticketPrice
      );

      setState({
        openSnack: true,
        vertical: "top",
        horizontal: "right",
        severity: "success",
        message: `Successfully added ${formDataVendor.numberOfTickets} tickets`,
      });
      handleClose();
    } catch (error) {
      setState({
        openSnack: true,
        vertical: "top",
        horizontal: "right",
        severity: "success",
        message: `Error occured while adding tickets`,
      });
    }
  };

  const [state, setState] = React.useState<State>({
    openSnack: false,
    vertical: "top",
    horizontal: "right",
    severity: "success",
    message: "",
  });

  const handleCloseSnack = () => {
    setState({ ...state, openSnack: false });
  };

  const { vertical, horizontal, openSnack, severity, message } = state;

  return (
    <div className="bg-white h-full p-4">
      <CustomSnackBar
        vertical={vertical}
        horizontal={horizontal}
        openSnack={openSnack}
        handleCloseSnack={handleCloseSnack}
        severity={severity}
        message={message}
      />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {events.map((event, index) => (
          <Card
            handleDelete={() => {
              handleDelete(event);
            }}
            handleBtnPress={() => {
              setSelectedEvent(event);
              handleOpen();
            }}
            userType={user?.role}
            disableBtn={event.eventStarted}
            image={event.photoUrl}
            name={event.name}
            date={event.startTime}
            key={index}
            location={event.location}
            availableTickets={
              user?.role === "CUSTOMER"
                ? event.tickets.filter((ticket) => !ticket.sold).length
                : user?.role === "VENDOR"
                ? event.tickets.filter((ticket) => ticket.sold).length
                : 0
            }
            cost={500}
            button={user?.role === "CUSTOMER" ? "Buy" : "Configure"}
            currency={"LKR"}
          />
        ))}
      </div>
      {user?.role === "VENDOR" || user?.role === "ADMIN" ? (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
         bg-white w-full  
          ${
            user?.role === "ADMIN" ? "max-w-2xl h-2/5" : "max-w-5xl h-3/5"
          } h-3/5  shadow-lg rounded overflow-hidden`}
          >
            <div className="grid grid-cols-1 gap-4 h-full ">
              <div className="overflow-y-auto flex flex-col p-4 justify-between h-full">
                <div className="flex flex-row justify-between mt-2">
                  <div className="flex flex-row flex-1 items-center justify-between">
                    <p className="text-2xl font-bold">{selectedEvent?.name}</p>
                    <button onClick={handleClose}>
                      <CloseIcon />
                    </button>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div>
                    <p className="text-sm font-light items-center ">
                      <EventIcon
                        sx={{ width: 14, mr: 1 }}
                        className="text-sm"
                      />
                      {formattedDate} @ {formattedTime}
                    </p>
                    <p className="text-sm font-light items-center ">
                      <FmdGoodIcon
                        sx={{ width: 14, mr: 1 }}
                        className="text-sm"
                      />
                      {selectedEvent?.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 flex-grow">
                  <div className="justify-evenly gap-2 flex flex-col">
                    <div className="flex flex-col gap-2">
                      <h2 className="font-bold">Configurations</h2>
                      <div className="grid grid-cols-2">
                        <div className="flex flex-row gap-2">
                          <p className="text-sm">Total Tickets : </p>
                          <p className="text-sm text-blue-600">
                            {" " +
                              selectedEvent?.configuration.totalNumberOfTickets}
                          </p>
                        </div>
                        <div className="flex flex-row gap-2">
                          <p className="text-sm">Ticket release rate : </p>
                          <p className="text-sm text-blue-600">
                            {selectedEvent?.configuration.ticketReleaseRate}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <div className="flex flex-row gap-2">
                          <p className="text-sm">Customer retrieval rate : </p>
                          <p className="text-sm text-blue-600">
                            {selectedEvent?.configuration.customerRetrievalRate}{" "}
                          </p>
                        </div>
                        <div className="flex flex-row gap-2">
                          <p className="text-sm"> Maximum pool capacity </p>
                          <p className="text-sm text-blue-600">
                            {selectedEvent?.configuration.maximumPoolCapacity}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-3">
                      {user.role === "VENDOR" && (
                        <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-800">
                              Ticket Price (LKR)
                            </p>
                            <input
                              className="border border-stone-400 rounded-lg border-r-2 p-2 text-sm"
                              type="number"
                              placeholder="Ticket Price"
                              // disabled={!selectedEvent?.eventStarted}

                              onChange={(e) =>
                                setFormDataVendor((prev) => ({
                                  ...prev,
                                  ticketPrice: Number(e.target.value),
                                }))
                              }
                            />
                            {errorsVendor.ticketPrice && (
                              <p className="text-red-500 text-sm">
                                {errorsVendor.ticketPrice}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-800">
                              Number of tickets
                            </p>
                            <input
                              className="border border-stone-400 rounded-lg border-r-2 p-2 text-sm"
                              type="number"
                              placeholder=" Number of tickets"
                              // disabled={!selectedEvent?.eventStarted}

                              onChange={(e) =>
                                setFormDataVendor((prev) => ({
                                  ...prev,
                                  numberOfTickets: Number(e.target.value),
                                }))
                              }
                            />
                            {errorsVendor.numberOfTickets && (
                              <p className="text-red-500 text-sm">
                                {errorsVendor.numberOfTickets}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {user.role === "VENDOR" ? (
                      <div className="mt-auto">
                        <button
                          className={` rounded-md p-2 w-full ${
                            !selectedEvent?.eventStarted
                              ? "bg-slate-400"
                              : "bg-blue-600"
                          }`}
                          type="button"
                          onClick={() => handleSubmit(selectedEvent?.id ?? 0)}
                          // disabled={selectedEvent?.eventStarted}
                        >
                          <p className="text-white font-bold">Add Tickets</p>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-auto">
                        {user.role === "ADMIN" && (
                          <button
                            className="bg-blue-600 rounded-md p-2 w-full"
                            type="button"
                            onClick={() =>
                              updateEventStatus(
                                selectedEvent?.id,
                                selectedEvent?.eventStarted
                              )
                            }
                          >
                            <p className="text-white font-semibold text-xs">
                              {selectedEvent?.eventStarted
                                ? "Stop event"
                                : "Start event"}
                            </p>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
       bg-white w-full p-4 max-w-7xl h-3/5  shadow-lg rounded overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4 h-full ">
              <div className="w-full h-full overflow-hidden">
                <img
                  className="w-full h-full object-cover rounded"
                  src={imageSrc}
                  alt="Event"
                  onError={() => setImageSrc(imageSrc)}
                />
              </div>

              <div className="overflow-y-auto flex flex-col justify-between h-full">
                <div className="flex justify-end items-end">
                  <button>
                    <CloseIcon onClick={handleClose} />
                  </button>
                </div>

                <p className="text-2xl font-bold">{selectedEvent?.name}</p>
                <p className="text-sm font-light items-center ">
                  <EventIcon sx={{ width: 14, mr: 1 }} className="text-sm" />
                  {formattedDate} @ {formattedTime}
                </p>
                <p className="text-sm font-light items-center ">
                  <FmdGoodIcon sx={{ width: 14, mr: 1 }} className="text-sm" />
                  {selectedEvent?.location}
                </p>

                <div className="my-6 grid grid-cols-1 gap-2 flex-grow">
                  <div className="justify-evenly gap-2 flex flex-col">
                    <input
                      className="border border-stone-400 rounded-lg border-r-2 p-2"
                      type="text"
                      placeholder="Name"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs">{errors.name}</p>
                    )}

                    <div className="border border-stone-400 rounded-lg p-2 ">
                      <div className="flex-row flex justify-between">
                        <div>
                          <p className="text-xs text-slate-500">Price</p>
                          <div className="flex-row flex gap-1 items-center">
                            <p className="text-xs text-blue-600">{"LKR"}</p>
                            <p className="text-xs text-blue-600">
                              {selectedEvent?.tickets
                                ?.filter((ticket) => !ticket.sold)
                                .at(-1)?.price ?? "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex-row flex gap-5 items-center">
                          <button type="button" onClick={handleMinusClick}>
                            <p className="font-bold text-lg">-</p>
                          </button>
                          <p>{formData.ticketAmount}</p>
                          <button onClick={handlePlusClick} type="button">
                            <p className="font-bold text-lg">+</p>
                          </button>
                        </div>
                      </div>

                      <div className="flex-row flex justify-between mt-4">
                        <p className="text-xs text-slate-500">Grand Total</p>
                        <div className="text-xs text-blue-600 flex flex-row gap-2">
                          <p>{"LKR"}</p>
                          <p>
                            {(selectedEvent?.tickets
                              ?.filter((ticket) => !ticket.sold)
                              ?.at(-1)?.price ?? 0) *
                              (formData.ticketAmount ?? 0)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button
                        className="bg-blue-600 rounded-md p-2 w-full"
                        type="button"
                        onClick={() => handleBuyClick(selectedEvent?.id)}
                      >
                        <p className="text-white font-bold">Buy</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Events;
