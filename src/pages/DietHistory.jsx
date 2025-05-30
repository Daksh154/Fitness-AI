import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Calendar, Activity } from "lucide-react";
import { X } from "lucide-react";
import config from "../config";

// Diet History Accordion Component
const DietHistoryAccordion = ({ onSelectPlan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDietHistory = async () => {
    if (!isOpen) return; // Only fetch data when opening the accordion

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${config.apiUrl}/api/diet/history?limit=5`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch diet history: ${response.status}`);
      }

      const data = await response.json();
      setHistoryData(data.plans);
    } catch (err) {
      console.error("Failed to fetch diet history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietHistory();
  }, [isOpen]); // Re-fetch when accordion is opened

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handler to stop event propagation and call onSelectPlan
  const handleViewDetails = (e, planId) => {
    console.log("View Details clicked for plan:", planId);
    e.stopPropagation();
    e.preventDefault();
    onSelectPlan(planId);
  };


  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 mb-8">
      <button
        className="w-full flex items-center justify-between text-white text-xl font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Calendar className="mr-2 text-purple-400" size={24} />
          <span>Diet Plan History</span>
        </div>
        {isOpen ? (
          <ChevronUp className="text-purple-400" size={24} />
        ) : (
          <ChevronDown className="text-purple-400" size={24} />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <p className="mt-2 text-purple-300">Loading history...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && historyData.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No diet plan history found
            </p>
          )}

          {!loading &&
            historyData.map((plan) => (
              <div
                key={plan._id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-300 text-sm mb-1">
                      <Calendar className="inline mr-2" size={16} />
                      {formatDate(plan.created_at)}
                    </p>
                    <div className="flex items-center text-white text-lg">
                      <Activity className="mr-2 text-purple-400" size={20} />
                      {plan.daily_calories} kcal · BMI: {plan.bmi.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={(e) => handleViewDetails(e, plan.id)}
                      className="text-xs bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 py-1 px-3 rounded-full transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

// Historic Diet Plan Detail Component
const HistoricDietPlanDetail = ({ planId, onBack }) => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchDietPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found. Please log in again."
          );
        }

        const response = await fetch(
          `${config.apiUrl}/api/diet/${planId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch diet plan: ${response.status}`);
        }

        const data = await response.json();
        setPlan(data);
      } catch (err) {
        console.error("Failed to fetch diet plan:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchDietPlan();
    }
  }, [planId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openDayPlan = (day, meals) => {
    setSelectedDay({ day, meals });
  };

  const closeDayPlan = () => {
    setSelectedDay(null);
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-purple-300 text-lg">Loading diet plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
        <button
          onClick={onBack}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Back to History
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center py-12">
        <p className="text-gray-400">Diet plan not found</p>
        <button
          onClick={onBack}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Diet Plan</h2>
        <p className="text-purple-300 text-sm">
          <Calendar className="inline mr-2" size={16} />
          {plan.created_at ? formatDate(plan.created_at) : "No date available"}
        </p>
      </div>

      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Nutrition Metrics</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-indigo-600/30 rounded-xl p-4 text-center">
            <p className="text-sm text-indigo-300 mb-1">BMR</p>
            <p className="text-white text-xl font-bold">{plan.bmr} kcal</p>
          </div>
          <div className="bg-violet-600/30 rounded-xl p-4 text-center">
            <p className="text-sm text-violet-300 mb-1">TDEE</p>
            <p className="text-white text-xl font-bold">{plan.tdee} kcal</p>
          </div>
          <div className="bg-pink-600/30 rounded-xl p-4 text-center">
            <p className="text-sm text-pink-300 mb-1">BMI</p>
            <p className="text-white text-xl font-bold">
              {plan.bmi.toFixed(1)}
            </p>
          </div>
          <div className="bg-purple-600/30 rounded-xl p-4 text-center">
            <p className="text-sm text-purple-300 mb-1">Daily Calories</p>
            <p className="text-white text-xl font-bold">
              {plan.daily_calories} kcal
            </p>
          </div>
        </div>

        {plan.macros && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-3">
              Recommended Macros
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/30 rounded-xl p-4 text-center">
                <p className="text-sm text-green-300 mb-1">Protein</p>
                <p className="text-white text-xl font-bold">
                  {plan.macros.protein}g
                </p>
              </div>
              <div className="bg-blue-500/30 rounded-xl p-4 text-center">
                <p className="text-sm text-blue-300 mb-1">Carbs</p>
                <p className="text-white text-xl font-bold">
                  {plan.macros.carbs}g
                </p>
              </div>
              <div className="bg-yellow-500/30 rounded-xl p-4 text-center">
                <p className="text-sm text-yellow-300 mb-1">Fat</p>
                <p className="text-white text-xl font-bold">
                  {plan.macros.fat}g
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {plan.plan && (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">
            Weekly Meal Plan
          </h3>
          <p className="text-gray-300 mb-6">
            Click on a day to view the detailed meal plan:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(plan.plan).map(([day, meals]) => (
              <div
                key={day}
                className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => openDayPlan(day, meals)}
              >
                <h4 className="text-lg font-semibold text-white mb-3">{day}</h4>
                <div className="space-y-2">
                  {Object.entries(meals).map(([mealType, mealData]) =>
                    mealType !== "snacks" && mealData ? (
                      <div
                        key={mealType}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-400 capitalize">
                          {mealType}
                        </span>
                        <span className="text-gray-300 truncate max-w-[70%] text-right">
                          {Array.isArray(mealData?.foods)
                            ? mealData.foods.join(", ")
                            : mealData
                                ?.map((s) => s.foods.join(", "))
                                .join(" | ")}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
                <div className="mt-4 text-center">
                  <span className="text-xs bg-purple-600/30 text-purple-300 py-1 px-3 rounded-full">
                    Click to view details
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Back to History
      </button>

      {selectedDay && (
        <DayMealPlanDialog
          day={selectedDay.day}
          meals={selectedDay.meals}
          onClose={closeDayPlan}
        />
      )}
    </div>
  );
};

// Reusing the DayMealPlanDialog from the original code
const DayMealPlanDialog = ({ day, meals, onClose }) => {
  if (!meals) return null;

  const mealTypes = ["breakfast", "lunch", "dinner"];
  const snacks = meals.snacks || [];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-purple-900/90 backdrop-blur-sm p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{day} Meal Plan</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {mealTypes.map((mealType) => {
            const meal = meals[mealType];
            if (!meal) return null;

            return (
              <div
                key={mealType}
                className="bg-white/5 rounded-lg border border-white/10 p-4"
              >
                <h4 className="text-lg font-semibold text-purple-400 capitalize mb-3">
                  {mealType}
                </h4>
                <p className="text-white text-md mb-3">
                  Foods: {meal.foods.join(", ")}
                </p>

                <div className="grid grid-cols-4 gap-3 mt-4">
                  <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                    <p className="text-sm text-purple-300 mb-1">Calories</p>
                    <p className="text-white font-bold">{meal.calories}</p>
                  </div>
                  <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                    <p className="text-sm text-blue-300 mb-1">Carbs</p>
                    <p className="text-white font-bold">{meal.macros.carbs}g</p>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-3 text-center">
                    <p className="text-sm text-green-300 mb-1">Protein</p>
                    <p className="text-white font-bold">
                      {meal.macros.protein}g
                    </p>
                  </div>
                  <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                    <p className="text-sm text-yellow-300 mb-1">Fat</p>
                    <p className="text-white font-bold">{meal.macros.fat}g</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Snacks Section */}
          {snacks.length > 0 && (
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h4 className="text-lg font-semibold text-purple-400 capitalize mb-3">
                Snacks
              </h4>
              {snacks.map((snack, index) => (
                <div key={index} className="mb-6">
                  <p className="text-white text-md mb-2">
                    Foods: {snack.foods.join(", ")}
                  </p>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-purple-300 mb-1">Calories</p>
                      <p className="text-white font-bold">{snack.calories}</p>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-blue-300 mb-1">Carbs</p>
                      <p className="text-white font-bold">
                        {snack.macros.carbs}g
                      </p>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-green-300 mb-1">Protein</p>
                      <p className="text-white font-bold">
                        {snack.macros.protein}g
                      </p>
                    </div>
                    <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-yellow-300 mb-1">Fat</p>
                      <p className="text-white font-bold">
                        {snack.macros.fat}g
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { DietHistoryAccordion, HistoricDietPlanDetail };
