"use client";

import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/utils/supabase-provider";
import { useUser } from "@/utils/useClient";
import LineChart from "@/components/LineChart";

// Simple statistic card
const StatisticsCard = ({ title, value, statusClass }) => {
  return (
    <div className="flex flex-col justify-center items-top border-0 h-full w-full dark:bg-dark-secondary bg-white rounded-md shadow-md">
      <div className="flex w-full mt-2">
        <div className="flex flex-grow items-center">
          <div aria-label="status" className={`status ${statusClass} ml-2`}></div>
          <p className="text-md font-medium dark:text-dark-light-text text-text-color text-left ml-2">
            {title}
          </p>
        </div>
      </div>
      <div className="flex items-top justify-center w-full h-full mt-2">
        <p className="text-[2.5rem] text-bold text-center dark:text-dark-text-color text-text-color">
          {value}
        </p>
      </div>
    </div>
  );
};

// Table showing weekend alcohol level vs count & avg grade
const WeekendLevelTable = ({ rows }) => {
  return (
    <div className="w-full h-full mt-2">
      {rows.length > 0 ? (
        <table className="min-w-full">
          <thead className="dark:bg-dark-secondary">
            <tr>
              <th className="text-l text-text-color dark:text-dark-text-color text-center">
                Rank
              </th>
              <th className="text-l text-text-color dark:text-dark-text-color text-center">
                Weekend Level (Walc)
              </th>
              <th className="text-l text-text-color dark:text-dark-text-color text-center">
                Students
              </th>
              <th className="text-l text-text-color dark:text-dark-text-color text-center">
                Avg Final Grade
              </th>
            </tr>
          </thead>
          <tbody className="dark:bg-dark-secondary">
            {rows.map((row, index) => (
              <tr key={row.level}>
                <td className="text-l text-text-color dark:text-dark-text-color text-center p-2 border-r-2 dark:border-dark-accent">
                  {index + 1}
                </td>
                <td className="text-l text-text-color dark:text-dark-text-color text-center">
                  {row.level}
                </td>
                <td className="text-l text-text-color dark:text-dark-text-color text-center p-2 border-l-2 dark:border-dark-accent">
                  {row.count}
                </td>
                <td className="text-l text-text-color dark:text-dark-text-color text-center p-2 border-l-2 dark:border-dark-accent">
                  {row.avgGrade.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="dark:text-dark-text-color">No data found</p>
      )}
    </div>
  );
};

// Card for manual entry form
const ManualEntryCard = ({ user, onSaved }) => {
  const [school, setSchool] = useState("");
  const [sex, setSex] = useState("F");
  const [age, setAge] = useState("");
  const [weekendAlcoholLevel, setWeekendAlcoholLevel] = useState("1");
  const [finalGrade, setFinalGrade] = useState("");
  const [absences, setAbsences] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/student-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          school,
          sex,
          age,
          weekendAlcoholLevel,
          finalGrade,
          absences,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "Failed to save entry.");
      } else {
        setMessage("Manual entry saved.");
        setSchool("");
        setAge("");
        setFinalGrade("");
        setAbsences("");
        if (typeof onSaved === "function") {
          onSaved();
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. Please try again.");
    }

    setSubmitting(false);
  };

  if (!user) {
    return (
      <div className="dark:bg-dark-secondary bg-white rounded-md shadow-md p-4 mt-4">
        <p className="dark:text-dark-text-color text-text-color">
          Log in to add your own manual student record.
        </p>
      </div>
    );
  }

  return (
    <div className="dark:bg-dark-secondary bg-white rounded-md shadow-md p-4 mt-4 max-w-xl">
      <h2 className="text-md font-medium text-text-color dark:text-dark-light-text mb-2">
        Add Manual Student Entry
      </h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="text-sm dark:text-dark-text-color text-text-color mb-1">
            School (optional)
          </label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="input input-bordered dark:bg-dark-primary bg-white text-text-color dark:text-dark-text-color"
            placeholder="e.g., GP or MS"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex flex-col">
            <label className="text-sm dark:text-dark-text-color text-text-color mb-1">
              Sex
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="select select-bordered dark:bg-dark-primary bg-white text-text-color dark:text-dark-text-color"
            >
              <option value="F">F</option>
              <option value="M">M</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-sm dark:text-dark-text-color text-text-color mb-1">
              Age
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input input-bordered dark:bg-dark-primary bg-white text-text-color dark:text-dark-text-color"
              required
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex flex-col">
            <label className="text-sm dark:text-dark-text-color text-text-color mb-1">
              Weekend Alcohol Level (Walc)
            </label>
            <select
              value={weekendAlcoholLevel}
              onChange={(e) => setWeekendAlcoholLevel(e.target.value)}
              className="select select-bordered dark:bg-dark-primary bg-white text-text-color dark:text-dark-text-color"
            >
              <option value="1">1 (very low)</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 (very high)</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-sm dark:text-dark-text-color text-text-color mb-1">
              Final Grade (G3)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={finalGrade}
              onChange={(e) => setFinalGrade(e.target.value)}
              className="input input-bordered dark:bg-dark-primary bg-white text-text-color dark:text-dark-text-color"
              required
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-sm dark:text-dark-text-color text-text-color mb-1">
              Absences
            </label>
            <input
              type="number"
              min="0"
              value={absences}
              onChange={(e) => setAbsences(e.target.value)}
              className="input input-bordered dark:bg-dark-primary bg-white text-text-color dark:text-dark-text-color"
              required
            />
          </div>
        </div>

        {message && (
          <p className="text-sm mt-1 text-text-color dark:text-dark-text-color">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Entry"}
        </button>
      </form>
    </div>
  );
};

export default function Metrics() {
  const { supabase } = useSupabase();
  const { user } = useUser(supabase);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalStudents, setTotalStudents] = useState(0);
  const [highRiskStudents, setHighRiskStudents] = useState(0);
  const [avgFinalGrade, setAvgFinalGrade] = useState(0);

  const [weekendRows, setWeekendRows] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDatasets, setChartDatasets] = useState([]);

  // Fetch Kaggle + manual data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Base Kaggle data
      const { data: baseData, error: baseError } = await supabase
        .from("student_alcohol_all")
        .select('id, school, sex, age, "Dalc", "Walc", "G3", absences');

      if (baseError) throw baseError;

      // Manual entries
      const { data: manualData, error: manualError } = await supabase
        .from("student_manual_entries")
        .select("id, school, sex, age, weekend_alcohol_level, final_grade, absences");

      if (manualError) throw manualError;

      const mappedBase = (baseData || []).map((row) => ({
        ...row,
        dataset: row.dataset ?? "base",
      }));

      const mappedManual = (manualData || []).map((row) => ({
        id: `manual-${row.id}`,
        dataset: "manual",
        school: row.school,
        sex: row.sex,
        age: row.age,
        Dalc: null,
        Walc: row.weekend_alcohol_level,
        G3: row.final_grade,
        absences: row.absences,
      }));

      const combined = [...mappedBase, ...mappedManual];

      console.log("combined rows:", combined.length);
      console.log("datasets:", Array.from(new Set(combined.map((r) => r.dataset))));

      setStudents(combined);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute metrics whenever students change
  useEffect(() => {
    if (!students || students.length === 0) {
      setTotalStudents(0);
      setHighRiskStudents(0);
      setAvgFinalGrade(0);
      setWeekendRows([]);
      setChartLabels([]);
      setChartDatasets([]);
      return;
    }

    const total = students.length;
    let highRisk = 0;
    let gradeSum = 0;

    const levelStats = {
      1: { count: 0, gradeSum: 0 },
      2: { count: 0, gradeSum: 0 },
      3: { count: 0, gradeSum: 0 },
      4: { count: 0, gradeSum: 0 },
      5: { count: 0, gradeSum: 0 },
    };

    students.forEach((s) => {
      const walc = s.Walc ?? s["Walc"];
      const g3 = s.G3 ?? s["G3"];
      const absences = s.absences;

      if (typeof g3 === "number") {
        gradeSum += g3;
      }

      if (
        typeof walc === "number" &&
        typeof g3 === "number" &&
        typeof absences === "number"
      ) {
        if (walc >= 4 && (g3 < 10 || absences > 10)) {
          highRisk += 1;
        }

        if (levelStats[walc]) {
          levelStats[walc].count += 1;
          levelStats[walc].gradeSum += g3;
        }
      }
    });

    const avgGrade = total > 0 ? gradeSum / total : 0;

    const rows = Object.entries(levelStats)
      .map(([level, { count, gradeSum }]) => ({
        level: Number(level),
        count,
        avgGrade: count > 0 ? gradeSum / count : 0,
      }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count);

    const labels = rows.map((r) => `Walc ${r.level}`);
    const dataset = [
      {
        label: "Avg final grade (G3) by weekend alcohol level",
        data: rows.map((r) => r.avgGrade),
        fill: false,
        borderColor: "#0d73ad",
        tension: 0.1,
      },
    ];

    setTotalStudents(total);
    setHighRiskStudents(highRisk);
    setAvgFinalGrade(avgGrade);
    setWeekendRows(rows);
    setChartLabels(labels);
    setChartDatasets(dataset);
  }, [students]);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-full">
        <p className="dark:text-dark-text-color text-text-color">Loading metrics...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </main>
    );
  }

  return (
    <main>
      <div className="grid grid-cols-6 grid-rows-12 mt-6 h-[40rem] w-full">
        {/* Left: Weekend alcohol distribution table */}
        <div className="flex flex-col justify-start items-top items-center border-0 col-span-2 row-span-12 mx-4 px-2 shadow-md dark:shadow-black bg-white dark:bg-dark-secondary rounded-md">
          <h2 className="text-md font-medium text-text-color dark:text-dark-light-text text-left mt-1 ml-2 w-full">
            Weekend Alcohol Level vs Final Grade
          </h2>
          <WeekendLevelTable rows={weekendRows} />
        </div>

        {/* Right top: statistic cards */}
        <div className="flex justify-start items-top col-span-4 row-span-4 px-2 mr-4">
          <div className="grid grid-cols-3 w-full gap-2">
            <div className="py-2 pr-2 pl-3">
              <StatisticsCard
                title="Total Students"
                value={totalStudents}
                statusClass="status-info"
              />
            </div>
            <div className="py-2 px-2">
              <StatisticsCard
                title="High-Risk Students"
                value={highRiskStudents}
                statusClass="status-error"
              />
            </div>
            <div className="py-2 pl-2 pr-3">
              <StatisticsCard
                title="Avg Final Grade (G3)"
                value={avgFinalGrade.toFixed(1)}
                statusClass="status-success"
              />
            </div>
          </div>
        </div>

        {/* Right bottom: line chart */}
        <div className="mt-4 mr-4 dark:bg-dark-secondary bg-white col-start-3 row-start-5 col-span-4 row-span-8 border-0 rounded-md shadow-md">
          <div className="h-full flex flex-col">
            <div className="mx-2 mt-1">
              <p className="flex-grow text-left font-medium dark:text-dark-light-text text-text-color">
                Detailed Statistics: Avg Final Grade vs Weekend Alcohol Level
              </p>
            </div>
            <div className="flex-shrink h-full">
              <LineChart labels={chartLabels} datasets={chartDatasets} />
            </div>
          </div>
        </div>
      </div>

      {/* Manual entry card */}
      <div className="mx-4 mb-6">
        <ManualEntryCard user={user} onSaved={fetchData} />
      </div>
    </main>
  );
}




