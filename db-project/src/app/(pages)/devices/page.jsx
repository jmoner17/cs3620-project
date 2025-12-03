'use client'

import React, { useState, useEffect } from "react";
import { useSupabase } from "@/utils/supabase-provider";
import { useRouter } from 'next/navigation';
import { useUser } from "@/utils/useClient";
import Link from 'next/link';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: undefined });
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export default function DevicesPage() {
  const { supabase } = useSupabase();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser(supabase);
  const router = useRouter();
  const size = useWindowSize();

  // Determine PAGE_SIZE based on window width.
  let PAGE_SIZE;
  if (size.width <= 640) {
    PAGE_SIZE = 2;
  } else if (size.width > 640 && size.width < 768) {
    PAGE_SIZE = 2;
  } else if (size.width > 768 && size.width < 1024) {
    PAGE_SIZE = 2;
  } else if (size.width > 1024 && size.width < 1280) {
    PAGE_SIZE = 3;
  } else if (size.width >= 1280) {
    PAGE_SIZE = 4;
  }
  
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Fetch devices for the logged in user.
  useEffect(() => {
    async function fetchDevices() {
      try {
        setLoading(true);
        if (user) {
          const { data, error } = await supabase
            .from("devices")
            .select("*")
            .eq("user_id", user.id);
          if (error) throw error;
          setDevices(data);
        }
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching devices.");
        setLoading(false);
      }
    }
    fetchDevices();
  }, [supabase, user]);

  // Calculate the paginated devices to display.
  const paginatedDevices = devices?.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  // Handler for clicking on a device card.
  const handleDeviceClick = (deviceId) => {
    router.push(`/devices/${deviceId}`);
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-between overflow-hidden">
        <h1 className="text-2xl font-bold text-text-color dark:text-dark-text-color text-center mt-5 border-b-2 border-theme-color pb-1">
          My Devices
        </h1>

        {/* Devices Grid */}
        <div className="relative container mx-auto flex flex-wrap items-center justify-center py-2 mt-2">
          {loading && <p>Loading devices...</p>}
          {error && <p>{error}</p>}
          {!loading && paginatedDevices && paginatedDevices.length > 0 ? (
            paginatedDevices.map((device) => (
              <div
                key={device.device_id}
                onClick={() => handleDeviceClick(device.device_id)}
                className="m-2 border border-gray-200 rounded-lg shadow bg-secondary dark:bg-dark-secondary dark:border-gray-700 p-4 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <h2 className="text-xl font-bold text-text-color dark:text-dark-text-color">
                  Device ID: {device.device_id}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Registered on: {new Date(device.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Status: {device.claimed ? "Linked" : "Unclaimed"}
                </p>
              </div>
            ))
          ) : (
            !loading && <p>No devices linked to your account.</p>
          )}

          {/* Card for linking a new device */}
          <div
            className="m-2 border border-dashed border-gray-400 rounded-lg shadow bg-secondary dark:bg-dark-secondary p-4 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/devices/Link')}
          >
            <span className="text-4xl text-theme-color">+</span>
            <span className="ml-2 text-lg text-text-color dark:text-dark-text-color">
              Link Device
            </span>
          </div>
        </div>

        {/* Pagination Controls: only show if total devices exceed PAGE_SIZE */}
        {devices && devices.length > PAGE_SIZE && (
          <div className="container mx-auto px-2 flex items-center justify-between mb-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={`inline-flex items-center px-3 py-2 text-sm text-center rounded-lg focus:outline-none text-white ${
                currentPage === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-80'
              } bg-[var(--theme-color)]`}
            >
              Older Devices
            </button>
            <button
              onClick={handleNextPage}
              disabled={!devices || (currentPage + 1) * PAGE_SIZE >= devices.length}
              className={`inline-flex items-center px-3 py-2 text-sm text-center rounded-lg focus:outline-none text-white ${
                (!devices || (currentPage + 1) * PAGE_SIZE >= devices.length)
                  ? 'opacity-20 cursor-not-allowed'
                  : 'hover:opacity-80'
              } bg-[var(--theme-color)]`}
            >
              Newer Devices
            </button>
          </div>
        )}
      </div>
    </main>
  );
}


