import React from "react";

function Dashboard() {
  return (
    <div>
      <div className="p-2 relative">
        {/* <div className="w-full bg-slate-100 rounded-md overflow-hidden relative aspect-square">
          <img src="https://assets.mytickets.lk/images/events/SOSL%20Christmas%20Concert/WhatsApp%20Image%202024-11-25%20at%2011.02.59-1732518463485.jpeg" >
        </div> */}
        <div className="px-2 pt-2 sm:pt-3 pb-1 sm:pb-2 flex flex-col gap-3">
          <p className="font-semibold body truncate">
            SOSL Christmas Concert 2024
          </p>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-calendar w-4 h-4"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <span className="w-full small truncate">
                Dec 13, 2024 • 07.00 PM IST
              </span>
            </span>
            <span className="flex items-center gap-2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-map-pin w-4 h-4"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <p className="small truncate">Bishops College Auditorium</p>
            </span>
          </div>
          <span className="flex gap-1 items-baseline">
            <p className="font-semibold text-primary font-clash-grotesk">
              2,000 LKR
            </p>
            <p className="small text-gray-500">upwards</p>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
