"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/utils/supabase-provider";
import { usePathname } from "next/navigation";
import { useUser } from "@/utils/useClient";
import LineChart from "@/components/LineChart";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

// Component for the device dropdown
const DeviceSelector = ({ devices, selectedDevice, onSelectDevice }) => {
  return (
    <div className="grid grid-cols-10 w-full h-16">
      <div className="flex justify-end items-center col-start-2 col-span-8 ">
        <label className="select">
          <span className="label">Devices</span>
          <select
            value={selectedDevice}
            onChange={(e) => {
              onSelectDevice(e.target.value);
              localStorage.setItem("selectedDevice", e.target.value);
            }}
          >
            {devices.length > 0 ? (
              devices.map((device) => (
                <option key={device.device_id} value={device.device_id}>
                  {device.device_id}
                </option>
              ))
            ) : (
              <option>No devices found</option>
            )}
          </select>
        </label>
      </div>
    </div>
  );
};

// Component for the Top Words table
const TopWordsTable = ({ sortedLabels, offset = 0 }) => {
  return (
    <div className="w-full h-full mt-2">
      {sortedLabels.length > 0 ? (
        <table className="min-w-full">
          <thead className="dark:bg-dark-secondary">
            <tr>
              <th className="text-l text-text-color dark:text-dark-text-color text-center">
                Rank
              </th>
              <th className="text-l text-text-color dark:text-dark-text-color text-center">
                Word
              </th>
              <th className="text-l text-text-color dark:text-dark-text-color text-center">
                Count
              </th>
            </tr>
          </thead>
          <tbody className="dark:bg-dark-secondary">
            {sortedLabels.map(([label, count], index) => (
              <tr key={label}>
                <td className="text-l text-text-color dark:text-dark-text-color text-center p-2 border-r-2 dark:border-dark-accent">
                  {index + 1 + offset}
                </td>
                <td className="text-l text-text-color dark:text-dark-text-color text-center">
                  {label}
                </td>
                <td className="text-l text-text-color dark:text-dark-text-color text-center p-2 border-l-2 dark:border-dark-accent">
                  {count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="dark:text-dark-text-color"> No data found </p>
      )}
    </div>
  );
};

const TopWordsPagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <div className="mt-2 mb-4 flex justify-center">
      <div className="join">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              className={`btn join-item btn-square ${
                currentPage === pageNumber
                  ? "bg-[#0d73ad] dark:text-dark-text-color text-text-color border-[#0d73ad] shadow-none"
                  : "dark:bg-[#191e25] bg-[#e2e8f0] dark:border-[#191e25] border-[#a0aec0] dark:text-dark-text-color text-text-color shadow-none"
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Component for statistic cards (Total Devices, Devices Online, Device Errors)
const StatisticsCard = ({ iconSrc, altText, title, count, statusClass }) => {
  return (
    <div className="flex flex-col justify-center items-top border-0 h-full w-full dark:bg-dark-secondary bg-white rounded-md shadow-md">
      <div className="flex w-full mt-2">
        <div className="flex flex-grow items-center">
          <div
            aria-label="status"
            className={`status ${statusClass} ml-2`}
          ></div>
          <p className="text-md font-medium dark:text-dark-light-text text-text-color text-left ml-2">
            {title}
          </p>
        </div>
        <div className="flex-none items-center mr-2 border-0 rounded-md dark:bg-dark-accent bg-secondary">
          <img
            src={iconSrc}
            alt={altText}
            className="w-9 h-9 p-1 rounded-md dark:invert"
          ></img>
        </div>
      </div>
      <div className="flex items-top justify-center w-full h-full mt-2">
        <p className="text-[3rem] text-bold text-center dark:text-dark-text-color text-text-color">
          {count}
        </p>
      </div>
    </div>
  );
};

// Component for the time view buttons (hour, day, week)
const TimeViewButtons = ({ activeView, onViewChange }) => {
  return (
    <div className="join rounded-md">
      <button
        className={`btn join-item ${activeView === "hour" ? "btn-active" : ""}`}
        onClick={() => onViewChange("hour")}
      >
        hour
      </button>
      <button
        className={`btn join-item ${activeView === "day" ? "btn-active" : ""}`}
        onClick={() => onViewChange("day")}
      >
        day
      </button>
      <button
        className={`btn join-item ${activeView === "week" ? "btn-active" : ""}`}
        onClick={() => onViewChange("week")}
      >
        week
      </button>
    </div>
  );
};

// Component for displaying progress bars with tick marks
const ProgressBars = ({ timeLabels, progressBarValues, tickMarks }) => {
  return (
    <div className="flex flex-col items-center justify-between p-4 gap-2 w-full h-full">
      {progressBarValues.map((value, index) => (
        <div key={index} className="flex items-center w-full">
          <div className="w-20 flex-none whitespace-nowrap mr-2 text-right dark:text-dark-text-color text-text-color">
            {timeLabels[index] ? timeLabels[index] : index + 1}
          </div>
          <div className="flex-grow">
            <progress
              className="progress w-full progress-primary"
              value={value}
              max="100"
            ></progress>
          </div>
        </div>
      ))}
      <div className="flex w-full">
        <div className="w-20 flex-none mr-2"></div>
        <div className="flex-grow">
          <div className="flex justify-between">
            {tickMarks.map((tick, index) => (
              <span key={index} className="text-xs dark:text-dark-text-color text-text-color">
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



export default function Metrics() {
  const { supabase } = useSupabase();
  const { user } = useUser(supabase);

  const [selectedDevice, setSelectedDevice] = useState(() => {
    if (typeof window !== "undefined") {
      const tmpSelectedDevice = localStorage.getItem("selectedDevice");
      return tmpSelectedDevice || "";
    }
    return "";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedDevice", selectedDevice);
    }
  }, [selectedDevice]);

  const [devices, setDevices] = useState([]);
  const [labelData, setLabelData] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [rawCounts, setRawCounts] = useState([]);
  const [tickMarks, setTickMarks] = useState([]);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("hour");

  const [currentResponseCount, setCurrentResponseCount] = useState(0);
  const [responseChangePercentage, setResponseChangePercentage] = useState(0);

  const dummyLabels = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM"];
  const dummyTotalData = [2, 10, 3, 5, 6, 2, 7];
  const dummyDevicesOnline = [12, 8, 16, 5, 12, 8, 4];
  const dummyDeviceErrors = [3, 24, 7, 2, 3, 6, 12];

  // State to track which dummy datasets should be displayed.
  const [selectedDatasets, setSelectedDatasets] = useState({
    total: true,
    online: true,
    errors: true,
  });

  // Aggregate datasets for the chart based on selectedDatasets.
  const chartDatasets = [];
  if (selectedDatasets.total) {
    chartDatasets.push({
      label: "Total Devices",
      data: dummyTotalData,
      fill: false,
      borderColor: "#0d73ad",
      tension: 0.1,
    });
  }
  if (selectedDatasets.online) {
    chartDatasets.push({
      label: "Devices Online",
      data: dummyDevicesOnline,
      fill: false,
      borderColor: "#28a745",
      tension: 0.1,
    });
  }
  if (selectedDatasets.errors) {
    chartDatasets.push({
      label: "Device Errors",
      data: dummyDeviceErrors,
      fill: false,
      borderColor: "#dc3545",
      tension: 0.1,
    });
  }

  // Fetch devices for the current user
  useEffect(() => {
    async function fetchDevices() {
      console.log("Inside fetchDevices, user:", user);
      if (!user) {
        console.log("User is not available yet; skipping devices fetch.");
        return;
      }
      try {
        const { data, error } = await supabase
          .from("devices")
          .select("*")
          .eq("user_id", user.id);
        if (error) throw error;
        console.log("Fetched devices:", data);
        setDevices(data);
      } catch (err) {
        setError("An error occurred while fetching devices.");
        console.error(err);
      }
    }
    fetchDevices();
  }, [supabase, user]);

  // Fetch label data when selectedDevice changes
  useEffect(() => {
    if (!selectedDevice) return;
    async function fetchLabelData() {
      const { data, error } = await supabase
        .from("keyword_predictions")
        .select("*")
        .eq("device_id", selectedDevice)
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setLabelData(data);
      }
    }
    fetchLabelData();
  }, [selectedDevice, supabase]);

  // Count occurrences of each predicted label.
  const labelCounts = {};
  labelData.forEach((row) => {
    const label = row.predicted_label;
    if (label) {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    }
  });

  // Get all sorted labels (unsliced) so we can paginate dynamically.
  const sortedLabelsAll = Object.entries(labelCounts).sort(
    (a, b) => b[1] - a[1]
  );

  // Pagination logic for top words.
  const itemsPerPage = 5;
  const [topWordsPage, setTopWordsPage] = useState(1);
  const totalPages = Math.ceil(sortedLabelsAll.length / itemsPerPage);
  const startIndex = (topWordsPage - 1) * itemsPerPage;
  const paginatedSortedLabels = sortedLabelsAll.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // State for progress bar values.
  const [progressBarValues, setProgressBarValues] = useState([0, 0, 0, 0, 0]);

  // Function to fetch time-related data
  async function fetchTimeData(viewType) {
    if (!selectedDevice) return;

    const now = new Date();
    let intervals = [];

    if (viewType === "hour") {
      // Create 5 intervals for the last 5 hours.
      for (let i = 4; i >= 0; i--) {
        const start = new Date(now);
        start.setMinutes(0, 0, 0);
        start.setHours(start.getHours() - i);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        intervals.push({ start, end });
      }
    } else if (viewType === "day") {
      // Create 5 intervals for the last 5 days.
      for (let i = 4; i >= 0; i--) {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - i);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        intervals.push({ start, end });
      }
    } else if (viewType === "week") {
      // Create 5 intervals for the last 5 weeks (assuming weeks start on Monday).
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(diff);
      currentWeekStart.setHours(0, 0, 0, 0);
      for (let i = 4; i >= 0; i--) {
        const start = new Date(currentWeekStart);
        start.setDate(start.getDate() - i * 7);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        intervals.push({ start, end });
      }
    }

    // Generate labels for each interval.
    const labels = intervals.map((interval) => {
      if (viewType === "hour") {
        return interval.start.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
      } else if (viewType === "day") {
        return interval.start.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      } else if (viewType === "week") {
        const endDate = new Date(interval.end);
        endDate.setDate(endDate.getDate() - 1);
        return `${endDate.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}`;
      }
    });
    setTimeLabels(labels);

    // Determine the overall time range to query.
    const overallStart = intervals[0].start.toISOString();
    const overallEnd = intervals[intervals.length - 1].end.toISOString();

    const { data, error } = await supabase
      .from("keyword_predictions")
      .select("*")
      .eq("device_id", selectedDevice)
      .gte("created_at", overallStart)
      .lt("created_at", overallEnd);
    if (error) {
      setError(error.message);
      return;
    }

    // Initialize an array to count predictions in each interval.
    const counts = new Array(intervals.length).fill(0);
    data.forEach((row) => {
      const created = new Date(row.created_at);
      intervals.forEach((interval, index) => {
        if (created >= interval.start && created < interval.end) {
          counts[index]++;
        }
      });
    });

    // Update statistics.
    const currentCount = counts[counts.length - 1] || 0;
    const previousCount =
      counts.length > 1 ? counts[counts.length - 2] || 0 : 0;
    setCurrentResponseCount(currentCount);

    let changePercentage = 0;
    if (previousCount === 0) {
      changePercentage = currentCount === 0 ? 0 : Infinity;
    } else {
      changePercentage = ((currentCount - previousCount) / previousCount) * 100;
    }
    setResponseChangePercentage(changePercentage);

    // Update progress bar values and tick marks.
    const maxCount = Math.max(...counts);
    const tickInterval = maxCount ? Math.ceil(maxCount / 4) : 0;
    const largestTick = tickInterval * 4;
    const progressValues = counts.map((count) =>
      largestTick ? (count / largestTick) * 100 : 0
    );
    setProgressBarValues(progressValues);
    const ticks = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(i * tickInterval);
    }
    setTickMarks(ticks);
  }

  useEffect(() => {
    if (selectedDevice) {
      fetchTimeData("hour");
    }
  }, [selectedDevice]);

  return (
    <main>
      <div>
        <DeviceSelector
          devices={devices}
          selectedDevice={selectedDevice}
          onSelectDevice={setSelectedDevice}
        />
        <div className="grid grid-cols-6 grid-rows-12 mt-6 h-[40rem] w-full">
          {/* Left-side: Top Words */}
          <div className="flex flex-col justify-start items-top items-center border-0 border-accent dark:border-dark-accent col-span-2 row-span-6 mx-4 px-2 shadow-md dark:shadow-black bg-white dark:bg-dark-secondary rounded-md ">
            <h2 className="text-md font-medium text-text-color dark:text-dark-light-text text-left mt-1 ml-2 w-full">
              Top Words
            </h2>
            <TopWordsTable
              sortedLabels={paginatedSortedLabels}
              offset={startIndex}
            />
            <TopWordsPagination
              totalPages={totalPages}
              currentPage={topWordsPage}
              onPageChange={setTopWordsPage}
            />
          </div>

          {/* Middle: Statistic Cards */}
          <div className="flex justify-start items-top col-span-4 row-span-4 px-2 mr-4">
            <div className="grid grid-cols-3 w-full">
              <div className="py-2 pr-2 pl-3">
                <StatisticsCard
                  title="Total Devices"
                  count={14}
                  iconSrc="/metrics/devices-total.svg"
                  altText="Devices Total"
                  statusClass="status-info"
                />
              </div>
              <div className="border-l-2 border-r-2 my-2 dark:border-theme-color border-theme-color px-2">
                <StatisticsCard
                  title="Devices Online"
                  count={8}
                  iconSrc="/metrics/devices-online.svg"
                  altText="Devices Online"
                  statusClass="status-success"
                />
              </div>
              <div className="pl-2 pr-3 py-2">
                <StatisticsCard
                  title="Device Errors"
                  count={3}
                  iconSrc="/metrics/devices-error.svg"
                  altText="Device Errors"
                  statusClass="status-error"
                />
              </div>
            </div>
          </div>

          {/* Left-side: Response Statistics and Progress Bars */}
          <div className="col-start-1 col-span-2 row-span-6 flex flex-col justify-start items-top items-center border-0 shadow-md bg-white dark:bg-dark-secondary rounded-md mx-4 mt-4">
            <div className="grid grid-cols-2 w-full mr-2">
              <div className="flex flex-col w-full mt-2 ml-2 justify-start">
                <p className="ml-3 font-medium dark:text-dark-light-text text-text-color text-left">
                  Response Statistics
                </p>
                <div className="flex justify-start w-full">
                  <p className="flex-grow max-w-28 text-bold text-4xl dark:text-dark-text-color text-text-color text-right">
                    {currentResponseCount}
                  </p>
                  <p
                    className={`flex-none text-md text-left ${
                      responseChangePercentage < 0
                        ? "text-red-500"
                        : "text-green-400"
                    }`}
                  >
                    {responseChangePercentage === Infinity
                      ? "+∞%"
                      : `${
                          responseChangePercentage >= 0 ? "+" : ""
                        }${responseChangePercentage.toFixed(2)}%`}
                  </p>
                </div>
              </div>
              <div className="flex flex-row-reverse mt-2 w-full">
                <TimeViewButtons
                  activeView={activeView}
                  onViewChange={(view) => {
                    setActiveView(view);
                    fetchTimeData(view);
                  }}
                />
              </div>
            </div>
            <ProgressBars
              timeLabels={timeLabels}
              progressBarValues={progressBarValues}
              tickMarks={tickMarks}
            />
          </div>

          {/* Right-side: Detailed Statistics */}
          <div className="mt-4 mr-4 dark:bg-dark-secondary bg-white col-start-3 row-start-5 col-span-4 row-span-8 border-0 rounded-md shadow-md">
            <div className="h-full flex flex-col">
              <div className="grid grid-cols-2 mx-2">
                <p className=" mt-1 ml-1 flex-grow text-left font-medium dark:text-dark-light-text text-text-color">
                  Detailed Statistics
                </p>
                <div className="flex flex-row-reverse mt-2 w-full">
                  <div className="join rounded-md">
                    <button
                      className={`btn join-item ${
                        activeView === "hour" ? "btn-active" : ""
                      }`}
                      onClick={() => {
                        setActiveView("hour");
                        fetchTimeData("hour");
                      }}
                    >
                      hour
                    </button>
                    <button
                      className={`btn join-item ${
                        activeView === "day" ? "btn-active" : ""
                      }`}
                      onClick={() => {
                        setActiveView("day");
                        fetchTimeData("day");
                      }}
                    >
                      day
                    </button>
                    <button
                      className={`btn join-item ${
                        activeView === "week" ? "btn-active" : ""
                      }`}
                      onClick={() => {
                        setActiveView("week");
                        fetchTimeData("week");
                      }}
                    >
                      week
                    </button>
                  </div>
                  <Menu as="div" className="relative inline-block text-left">
                    <div className="flex flew-row w-full items-center mr-2">
                      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md pr-3 py-2 text-sm font-semibold dark:text-dark-text-color text-text-color shadow-xs link no-underline">
                        Options
                      </MenuButton>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="mr-2 -ml-3 size-5 text-gray-400"
                      />
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md dark:bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      <div className="py-1">
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm dark:text-dark-text text-text-color data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDatasets.total}
                              onChange={() =>
                                setSelectedDatasets((prev) => ({
                                  ...prev,
                                  total: !prev.total,
                                }))
                              }
                              className="checkbox checkbox-neutral mr-2"
                            />
                            Total Devices
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm dark:text-dark-text text-text-color data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDatasets.online}
                              onChange={() =>
                                setSelectedDatasets((prev) => ({
                                  ...prev,
                                  online: !prev.online,
                                }))
                              }
                              className="checkbox checkbox-neutral mr-2"
                            />
                            Devices Online
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm dark:text-dark-text text-text-color data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDatasets.errors}
                              onChange={() =>
                                setSelectedDatasets((prev) => ({
                                  ...prev,
                                  errors: !prev.errors,
                                }))
                              }
                              className="checkbox checkbox-neutral mr-2"
                            />
                            Device Errors
                          </a>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                </div>
                <div className="ml-4">
                  <p className="text-medium dark:text-dark-light-text text-text-color text-md">
                    Devices Online {" "} 
                  </p>
                </div>
              </div>
              <div className="flex-shrink h-full">
                <LineChart labels={dummyLabels} datasets={chartDatasets} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
