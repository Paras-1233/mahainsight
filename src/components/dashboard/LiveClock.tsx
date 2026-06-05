"use client";

import {
  useEffect,
  useState,
} from "react";

import { Clock3 } from "lucide-react";

export default function LiveClock() {

  const [currentTime,
    setCurrentTime] =
    useState("");

  const [greeting,
    setGreeting] =
    useState("");

  function getGreeting() {

    const hour =
      new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 18) {
      return "Good Afternoon";
    }

    return "Good Evening";

  }

  useEffect(() => {

    const updateClock = () => {

      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );

      setGreeting(
        getGreeting()
      );

    };

    updateClock();

    const timer =
      setInterval(
        updateClock,
        1000
      );

    return () =>
      clearInterval(timer);

  }, []);

  return (

    <div className="flex items-center gap-3 text-slate-400">

      <Clock3 size={18} />

      <div className="flex flex-col leading-tight">

        <span className="text-sm font-medium tracking-wide">

          {currentTime}

        </span>

        <span className="text-xs text-slate-500">

          {greeting}

        </span>

      </div>

    </div>

  );

}