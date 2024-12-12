import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Modal, SnackbarOrigin } from "@mui/material";
import HomePage from "./Home";
import CloseIcon from "@mui/icons-material/Close";
import { saveEvent } from "../consts/apiService";
import Events from "./Events";
import CustomSnackBar from "../components/CustomSnackBar";
import { useUser } from "../contexts/UserContexts";

interface State extends SnackbarOrigin {
  openSnack: boolean;
  severity: "success" | "error";
  message: string;
}

interface Config {
  totalNumberOfTickets: number;
  maximumPoolCapacity: number;
  ticketReleaseRate: number;
  customerRetrievalRate: number;
}

interface EventData {
  name: string;
  location: string;
  startTime: string;
  photoUrl: string;
  configuration: Config;
}

function Main() {
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    location: "",
    photoUrl: "",
    startTime: "",
    configuration: {
      totalNumberOfTickets: 0,
      maximumPoolCapacity: 0,
      ticketReleaseRate: 0,
      customerRetrievalRate: 0,
    },
  });
  const [open, setOpen] = React.useState(false);

  const [state, setState] = React.useState<State>({
    openSnack: false,
    vertical: "top",
    horizontal: "right",
    severity: "success",
    message: "",
  });
  const { vertical, horizontal, openSnack, severity, message } = state;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { user } = useUser();

  const handleInputChange = (
    field: keyof EventData | keyof Config,
    value: string | number,
    isNested: boolean = false
  ) => {
    if (isNested) {
      setEventData((prev) => ({
        ...prev,
        configuration: {
          ...prev.configuration,
          [field as keyof Config]: value,
        },
      }));
    } else {
      setEventData((prev) => ({
        ...prev,
        [field as keyof EventData]: value,
      }));
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!eventData.name) newErrors.eventName = "Event name is required.";
    if (!eventData.startTime) newErrors.eventName = "Event name is required.";
    if (!eventData.location) newErrors.location = "Location is required.";
    if (!eventData.startTime) newErrors.startTime = "Start time is required.";
    if (eventData.configuration.totalNumberOfTickets <= 0)
      newErrors.totalTickets = "Total tickets must be greater than 0.";
    if (eventData.configuration.maximumPoolCapacity <= 0)
      newErrors.maximumPoolCapacity = "Pool size must be greater than 0.";
    if (
      eventData.configuration.maximumPoolCapacity >=
      eventData.configuration.totalNumberOfTickets
    )
      newErrors.maximumPoolCapacity = "Pool size must be greater total tickets";
    if (eventData.configuration.customerRetrievalRate <= 0)
      newErrors.customerRetrievalRate =
        "Customer retrieval rate must be greater than 0.";
    if (eventData.configuration.ticketReleaseRate <= 0)
      newErrors.ticketReleaseRate =
        "Ticket release rate must be greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleAddTicket = async () => {
    if (validateInputs()) {
      try {
        await saveEvent(eventData);
        setState({
          openSnack: true,
          vertical: "top",
          horizontal: "right",
          severity: "success",
          message: "Event saved successfully!",
        });
        handleClose();
      } catch (error) {
        console.error("Failed to save event", error);
        setState({
          openSnack: true,
          vertical: "top",
          horizontal: "right",
          severity: "error",
          message: "Event saved successfully!",
        });
      }
    }
  };

  const handleCloseSnack = () => {
    setState({ ...state, openSnack: false });
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <>
      <Navbar handleBtnPress={handleOpen} />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <CustomSnackBar
        vertical={vertical}
        horizontal={horizontal}
        openSnack={openSnack}
        handleCloseSnack={handleCloseSnack}
        severity={severity}
        message={message}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
         bg-white w-full max-w-7xl h-3/5  shadow-lg rounded overflow-hidden"
        >
          <div className="grid grid-cols-1 gap-4 h-full ">
            <div className="overflow-y-auto  p-4 flex flex-col justify-start h-full">
              <div className="flex  justify-between items-end">
                <p className="font-bold text-lg ">Create an Event</p>
                <button>
                  <CloseIcon onClick={handleClose} />
                </button>
              </div>
              <div className="m-4 flex flex-col gap-2">
                <div className="grid grid-cols-1">
                  <div className="justify-start gap-2 flex flex-col">
                    <input
                      className="border border-stone-400 rounded-lg border-r-2 p-2 text-sm"
                      type="text"
                      placeholder="Event name"
                      value={eventData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                    {errors.eventName && (
                      <p className="text-red-500 text-xs">{errors.eventName}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <div className="justify-start gap-2 flex flex-col">
                    <input
                      className="border border-stone-400 rounded-lg border-r-2 p-2 text-sm"
                      type="text"
                      placeholder="Location"
                      value={eventData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs">{errors.location}</p>
                    )}
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                  <div className="justify-start flex gap-1 flex-col">
                    <p className="text-xs text-gray-800">Event Start</p>
                    <input
                      className="border border-stone-400 rounded-lg border-r-2 p-2 text-sm"
                      type="datetime-local"
                      onChange={(e) =>
                        handleInputChange(
                          "startTime",
                          new Date(e.target.value).toISOString()
                        )
                      }
                    />
                    {errors.eventStart && (
                      <p className="text-red-500 text-xs">
                        {errors.eventStart}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                  <div className="justify-start gap-2 flex flex-col">
                    <p className="text-xs text-gray-800">
                      Total tickets for the event
                    </p>
                    <input
                      className="border border-stone-400 rounded-lg border-r-2 p-2 text-sm"
                      type="number"
                      placeholder="Total tickets"
                      value={eventData.configuration.totalNumberOfTickets || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "totalNumberOfTickets",
                          Number(e.target.value),
                          true
                        )
                      }
                    />
                    {errors.totalTickets && (
                      <p className="text-red-500 text-xs">
                        {errors.totalTickets}
                      </p>
                    )}
                  </div>
                  <div className="justify-start gap-2 flex flex-col">
                    <p className="text-xs text-gray-800">Ticket pool size</p>
                    <input
                      className="border border-stone-400 rounded-lg border-r-2 p-2 text-sm"
                      type="number"
                      placeholder="Pool size"
                      value={eventData.configuration.maximumPoolCapacity || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "maximumPoolCapacity",
                          Number(e.target.value),
                          true
                        )
                      }
                    />
                    {errors.maximumPoolCapacity && (
                      <p className="text-red-500 text-xs">
                        {errors.maximumPoolCapacity}
                      </p>
                    )}
                  </div>
                  <div className="justify-start gap-2 flex flex-col">
                    <p className="text-xs text-gray-800">
                      Customer retrieval rate
                    </p>
                    <input
                      className="border border-stone-400 rounded-lg border-r-2 p-2 text-sm"
                      type="number"
                      placeholder="Retrieval rate"
                      value={
                        eventData.configuration.customerRetrievalRate || ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "customerRetrievalRate",
                          Number(e.target.value),
                          true
                        )
                      }
                    />
                    {errors.customerRetrievalRate && (
                      <p className="text-red-500 text-xs">
                        {errors.customerRetrievalRate}
                      </p>
                    )}
                  </div>
                  <div className="justify-start gap-2 flex flex-col">
                    <p className="text-xs text-gray-800">Vendor release rate</p>
                    <input
                      className="border border-stone-400 rounded-lg border-r-2 p-2 text-sm"
                      type="number"
                      placeholder="Release rate"
                      value={eventData.configuration.ticketReleaseRate || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "ticketReleaseRate",
                          Number(e.target.value),
                          true
                        )
                      }
                    />
                    {errors.ticketReleaseRate && (
                      <p className="text-red-500 text-xs">
                        {errors.ticketReleaseRate}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className="bg-blue-500 text-white rounded-lg p-2 mt-4"
                  onClick={handleAddTicket}
                >
                  {user?.role === "ADMIN" ? "Add Event" : "Add Ticket"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Main;
