// import { Outlet } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import { useModules } from "@/context/ModulesContext";
// import useAuth from "@/features/auth/useAuth";

// const DashboardLayout = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   // We extract tree and loading status from context. 
//   // The context handles the fetching logic automatically.
//   const { menu, isTreeLoading } = useModules();
//   const { user } = useAuth()

//   // Load collapse state from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("sidebar-collapsed");
//     if (saved !== null) {
//       setCollapsed(JSON.parse(saved));
//     }
//   }, []);

//   const toggleSidebar = () => {
//     const newState = !collapsed;
//     setCollapsed(newState);
//     localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 overflow-hidden">
//       {/* ===== SIDEBAR ===== */}
//       <Sidebar
//         collapsed={collapsed}
//         menuItems={menu}
//         user={user}
//         isLoading={isTreeLoading}
//         // Tip: Consider getting these permissions from AuthContext instead of hardcoding
//         userPermissions={["DASHBOARD.VIEW", "TENANTS.VIEW"]}
//         toggleSidebar={toggleSidebar}
//       />

//       {/* ===== MAIN AREA ===== */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         {/* ===== HEADER ===== */}
//         <div className="shrink-0">
//           <Header toggleSidebar={toggleSidebar} />
//         </div>

//         {/* ===== CONTENT ===== */}
//         <main className="flex-1 overflow-y-auto p-4 shadow-md">
//           {/* Outlet renders the child route components */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;









import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import Header from "./Header";
import Sidebar from "./Sidebar";

import { useModules } from "@/context/ModulesContext";
import useAuth from "@/features/auth/useAuth";

import ringSound from "@/assets/RingSound.mp3";

import { toast } from "react-hot-toast";

const DashboardLayout = () => {

  // ==============================
  // STATES
  // ==============================

  const [collapsed, setCollapsed] = useState(false);

  const {
    menu,
    isTreeLoading
  } = useModules();

  const { user } = useAuth();

  // ==============================
  // REFS
  // ==============================

  const socketRef = useRef(null);
  const ringAudioRef = useRef(null);

  // ==============================
  // LOAD SIDEBAR STATE
  // ==============================

  useEffect(() => {

    const saved =
      localStorage.getItem("sidebar-collapsed");

    if (saved !== null) {
      setCollapsed(JSON.parse(saved));
    }

  }, []);

  // ==============================
  // TOGGLE SIDEBAR
  // ==============================

  const toggleSidebar = () => {

    const newState = !collapsed;

    setCollapsed(newState);

    localStorage.setItem(
      "sidebar-collapsed",
      JSON.stringify(newState)
    );
  };

  // ==============================
  // PRELOAD AUDIO
  // ==============================

  useEffect(() => {

    const audio = new Audio(ringSound);

    audio.preload = "auto";

    ringAudioRef.current = audio;

    // unlock autoplay
    const unlockAudio = async () => {

      try {

        await audio.play();

        audio.pause();

        audio.currentTime = 0;

        console.log("🔊 Audio unlocked");

      } catch (err) {

        console.log("Audio unlock blocked");

      }

      window.removeEventListener(
        "click",
        unlockAudio
      );
    };

    window.addEventListener(
      "click",
      unlockAudio
    );

    return () => {

      window.removeEventListener(
        "click",
        unlockAudio
      );
    };

  }, []);

  // ==============================
  // SOCKET CONNECTION
  // ==============================

  useEffect(() => {

    // IMPORTANT:
    // backend namespace MUST match this
    socketRef.current = io(
      "http://localhost:3001/bookings",
      {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      }
    );

    const socket = socketRef.current;

    // ==============================
    // CONNECT
    // ==============================

    socket.on("connect", () => {

      console.log(
        "✅ Socket Connected:",
        socket.id
      );
    });

    // ==============================
    // NEW BOOKING EVENT
    // ==============================

    socket.on("booking:new", (data) => {

      console.log(
        "🔥 LIVE BOOKING RECEIVED:",
        data
      );

      // PLAY SOUND

      if (ringAudioRef.current) {

        ringAudioRef.current.currentTime = 0;

        ringAudioRef.current
          .play()
          .catch((err) => {
            console.log(
              "❌ Audio play blocked:",
              err
            );
          });
      }

      // SHOW TOAST

      toast.success(
        `New Booking #${data.booking_code}`,
        {
          duration: 5000,
        }
      );

      // OPTIONAL:
      // trigger refresh event

      window.dispatchEvent(
        new CustomEvent(
          "booking-created",
          {
            detail: data,
          }
        )
      );
    });

    // ==============================
    // SOCKET ERRORS
    // ==============================

    socket.on(
      "connect_error",
      (err) => {

        console.error(
          "❌ Socket Error:",
          err.message
        );
      }
    );

    socket.on("disconnect", () => {

      console.log(
        "❌ Socket Disconnected"
      );
    });

    // ==============================
    // CLEANUP
    // ==============================

    return () => {

      socket.off("booking:new");

      socket.off("connect");

      socket.off("disconnect");

      socket.off("connect_error");

      socket.disconnect();
    };

  }, []);

  // ==============================
  // UI
  // ==============================

  return (

    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ===== SIDEBAR ===== */}

      <Sidebar
        collapsed={collapsed}
        menuItems={menu}
        user={user}
        isLoading={isTreeLoading}
        userPermissions={[
          "DASHBOARD.VIEW",
          "TENANTS.VIEW"
        ]}
        toggleSidebar={toggleSidebar}
      />

      {/* ===== MAIN AREA ===== */}

      <div className="flex flex-col flex-1 overflow-hidden">

        {/* ===== HEADER ===== */}

        <div className="shrink-0">

          <Header
            toggleSidebar={toggleSidebar}
          />

        </div>

        {/* ===== CONTENT ===== */}

        <main className="flex-1 overflow-y-auto p-4 shadow-md">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;