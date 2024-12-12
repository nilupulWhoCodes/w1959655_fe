import { Badge } from "@mui/material";
import React, { useState } from "react";
import { useFormattedDateTime } from "../hooks/useFormattedDateTimeHook";
import PlaceholderImg from "../assets/imgs/7084233.jpg";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import EventIcon from "@mui/icons-material/Event";
import DeleteIcon from "@mui/icons-material/Delete";

interface CardProps {
  image: string;
  name: string;
  date: string;
  location: string;
  availableTickets: number;
  handleBtnPress: () => void;
  cost: number;
  currency: string;
  button: string;
  handleDelete: () => void;
  userType: string | undefined;
  disableBtn: boolean;
}

const placeholderImage = PlaceholderImg;

const Card: React.FC<CardProps> = ({
  handleBtnPress,
  image,
  name,
  date,
  location,
  availableTickets,
  cost,
  currency,
  button,
  userType,
  handleDelete,
  disableBtn,
}) => {
  const eventDate = new Date(date);
  const { formattedDate, formattedTime } = useFormattedDateTime(eventDate);
  const [imageSrc, setImageSrc] = useState(image || placeholderImage);

  return (
    <Badge
      badgeContent={userType === "ADMIN" ? 0 : availableTickets}
      color="primary"
    >
      <div className="group relative flex flex-col w-full max-w-sm flex-1 bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ">
        <div className="h-full w-full ">
          <img
            src={imageSrc}
            alt="Event"
            className="w-full h-full object-contain"
            onError={() => setImageSrc(placeholderImage)}
          />
        </div>

        <div className="pt-2 pb-2 pl-2 pr-2 flex flex-col items-start">
          <h2 className="text-lg font-bold mb-2">{name}</h2>

          <div className="flex items-center text-sm text-gray-600">
            <EventIcon sx={{ width: 14, mr: 1 }} className="text-sm" />
            <p>
              {formattedDate} at {formattedTime}
            </p>
          </div>

          <div className="flex items-center text-sm text-gray-600 mt-2">
            <FmdGoodIcon sx={{ width: 14, mr: 1 }} className="text-sm" />
            <p>{location}</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
          {userType === "ADMIN" && (
            <button
              onClick={handleDelete}
              className="absolute text-white top-2 right-2"
            >
              <DeleteIcon />
            </button>
          )}
          <button
            onClick={handleBtnPress}
            className={`px-6 py-2 rounded-lg shadow-md ${
              !disableBtn && userType !== "ADMIN"
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={!disableBtn && userType !== "ADMIN"}
          >
            {button}
          </button>
        </div>
      </div>
    </Badge>
  );
};

export default Card;
