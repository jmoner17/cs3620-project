"use client";

import { usePathname } from "next/navigation";
import { useSupabase } from "@/utils/supabase-provider";
import { useState, useEffect } from "react";
import { useUser } from "@/utils/useClient";
import { useRouter } from "next/navigation";

export default function Devices() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname ? pathname.split("/").pop() : null;

  // Get the client-side supabase instance and user
  const { supabase } = useSupabase();
  const { user, loading } = useUser(supabase);

  const [device, setDevice] = useState(null);
  const [error, setError] = useState("");

  const [labelData, setLabelData] = useState([]);

  useEffect(() => {
    if (loading) return;

    //if no user login throw 401 error and redirect to login page
    if (!user) {
      setError("401 - Not Authenticated");
      router.push("/login");
      return;
    }
    // fetch overview information about the device itself
    const fetchDeviceData = async () => {
      const { data, error } = await supabase
        .from("devices")
        .select("*")
        .eq("device_id", id)
        .single();
      if (error) {
        setError(error.message);
      } else {
        setDevice(data);
      }
    };
    fetchDeviceData();

    //fetch the last 10 predicted labels for this device
    const fetchLabelData = async () => {
      const { data, error } = await supabase
        .from("keyword_predictions")
        .select("*")
        .eq("device_id", id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) {
        setError(error.message);
      } else {
        setLabelData(data);
      }
    };

    fetchLabelData();
  }, [user, loading, supabase, router]);

  //using supabase subscriptions to automatically update for new label inserts to supabase DB
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel("keyword_predictions_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "keyword_predictions",
          filter: `device_id=eq.${id}`,
        },
        (payload) => {
          // Prepend the new row and keep only the latest 10 rows
          setLabelData((prev) => [payload.new, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, supabase]);

  return (
    <main className="relative flex flex-col items-center justify-center p-4">
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {/* Device Information Table */}
      <div className="w-full max-w-lg mb-8 rounded-lg overflow-hidden shadow-md border">
        {device ? (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-secondary-color dark:bg-dark-secondary-color">
                <th className="border px-4 py-2 text-text-color dark:text-dark-text-color">
                  Device ID
                </th>
                <th className="border px-4 py-2 text-text-color dark:text-dark-text-color">
                  User ID
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-primary-color dark:bg-dark-primary-color">
                <td className="border px-4 py-2">{device.device_id}</td>
                <td className="border px-4 py-2">{device.user_id}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="p-4">Loading device info...</p>
        )}
      </div>

      {/* Label Data Table */}
      <div className="w-full max-w-lg rounded-lg overflow-hidden shadow-md border">
        {labelData.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-secondary-color dark:bg-dark-secondary-color">
                <th className="border px-4 py-2 text-text-color dark:text-dark-text-color">
                  Predicted Label
                </th>
                <th className="border px-4 py-2 text-text-color dark:text-dark-text-color">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {labelData.map((label) => {
                const localDate = new Date(label.created_at);
                return (
                  <tr
                    key={label.id}
                    className="bg-primary-color dark:bg-dark-primary-color"
                  >
                    <td className="border px-4 py-2">
                      {label.predicted_label}
                    </td>
                    <td className="border px-5 py-2">
                      {localDate.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="p-4">Loading label data...</p>
        )}
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="py-8 flex flex-col items-center justify-center">
          <button
            onClick={() => router.push("/unlink-device")}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-text-color dark:text-dark-text-color bg-theme-color dark:bg-dark-theme-color hover:opacity-50 focus:outline-none mb-4"
          >
            Unlink Device
          </button>
        </div>
      </div>
    </main>
  );
}
