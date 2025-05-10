import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  WorkoutHistory,
  WorkoutForm,
  WorkoutPlanDisplay,
} from "./Workoutdialog";

const WorkoutPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  // Fetch specific plan when a plan ID is selected
  useEffect(() => {
    if (selectedPlanId) {
      fetchPlanById(selectedPlanId);
    }
  }, [selectedPlanId]);

  const fetchPlanById = async (planId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/workout/${planId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            `Server responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError("Error loading workout plan: " + err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkout = async (formData) => {
    setLoading(true);
    setError(null);
    setSelectedPlanId(null);

    // Convert string values to numbers before sending to the backend
    const processedData = {
      ...formData,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      age: parseInt(formData.age, 10),
    };

    try {
      const response = await fetch("http://localhost:8000/api/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            `Server responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      setPlan(data);
      setShowIntro(false);

      // Trigger history refresh after adding new plan
      setHistoryRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError("Error generating workout plan: " + err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    setShowIntro(false);
  };

  const toggleIntro = () => {
    setShowIntro(!showIntro);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/home"
            className="inline-flex items-center text-white hover:text-purple-400 transition"
          >
            <ArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Personalized Workout Plans
            </h1>

            <div
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 cursor-pointer mb-6"
              onClick={toggleIntro}
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-300">
                  Learn how our AI generates your custom workout plan
                </p>
                {showIntro ? (
                  <ChevronUp className="text-purple-400" size={18} />
                ) : (
                  <ChevronDown className="text-purple-400" size={18} />
                )}
              </div>

              {showIntro && (
                <div className="mt-4 text-gray-300 text-sm space-y-2">
                  <p>
                    Our advanced AI analyzes your physical characteristics,
                    activity level, and fitness goals to create a personalized
                    workout plan that's just right for you.
                  </p>
                  <p>
                    Each plan includes carefully selected exercises, sets, and
                    repetitions to help you achieve your goals efficiently and
                    safely.
                  </p>
                  <p>
                    Fill out the form below to generate your custom workout
                    plan, or view your workout history to see past plans.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
          </div>
          {/* History section below */}
          <div className="mb-8">
            <WorkoutHistory
              onSelectPlan={handleSelectPlan}
              shouldRefresh={historyRefreshTrigger}
            />
          </div>
          {/* Full width form */}
          <div className="mb-8">
            <WorkoutForm onSubmit={handleGenerateWorkout} loading={loading} />
          </div>

          {/* Generated plan */}
          {plan && (
            <div className="mb-8 animate-fadeIn">
              <WorkoutPlanDisplay plan={plan} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlan;
