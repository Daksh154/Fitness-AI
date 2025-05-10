import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const DayMealPlanDialog = ({ day, meals, onClose }) => {
  if (!meals) return null;

  const mealTypes = ['breakfast', 'lunch', 'dinner'];
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
              <div key={mealType} className="bg-white/5 rounded-lg border border-white/10 p-4">
                <h4 className="text-lg font-semibold text-purple-400 capitalize mb-3">{mealType}</h4>
                <p className="text-white text-md mb-3">Foods: {meal.foods.join(', ')}</p>

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
                    <p className="text-white font-bold">{meal.macros.protein}g</p>
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
              <h4 className="text-lg font-semibold text-purple-400 capitalize mb-3">Snacks</h4>
              {snacks.map((snack, index) => (
                <div key={index} className="mb-6">
                  <p className="text-white text-md mb-2">Foods: {snack.foods.join(', ')}</p>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-purple-300 mb-1">Calories</p>
                      <p className="text-white font-bold">{snack.calories}</p>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-blue-300 mb-1">Carbs</p>
                      <p className="text-white font-bold">{snack.macros.carbs}g</p>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-green-300 mb-1">Protein</p>
                      <p className="text-white font-bold">{snack.macros.protein}g</p>
                    </div>
                    <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-yellow-300 mb-1">Fat</p>
                      <p className="text-white font-bold">{snack.macros.fat}g</p>
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

const MacroCard = ({ label, value, unit, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-xl p-5 text-center`}>
    <p className={`text-sm ${textColor} mb-1`}>{label}</p>
    <p className="text-white text-2xl font-bold">{value}{unit}</p>
  </div>
);

const InfoTooltip = ({ message }) => (
  <div className="group relative inline-block ml-2">
    <Info size={16} className="text-gray-400 cursor-help" />
    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-black/80 text-white text-xs rounded p-2 w-48 transition-all duration-200 z-10">
      {message}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-black/80"></div>
    </div>
  </div>
);

const DayCard = ({ day, meals, onClick }) => (
  <div 
    className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all"
    onClick={() => onClick(day, meals)}
  >
    <h3 className="text-lg font-semibold text-white mb-3">{day}</h3>
    <div className="space-y-2">
      {Object.entries(meals).map(([mealType, mealData]) => (
        mealType !== 'snacks' && mealData ? (
          <div key={mealType} className="flex justify-between text-sm">
            <span className="text-gray-400 capitalize">{mealType}</span>
            <span className="text-gray-300 truncate max-w-[70%] text-right">
              {Array.isArray(mealData?.foods)
                ? mealData.foods.join(', ')
                : mealData?.map(s => s.foods.join(', ')).join(' | ')}
            </span>
          </div>
        ) : null
      ))}
    </div>
    <div className="mt-4 text-center">
      <span className="text-xs bg-purple-600/30 text-purple-300 py-1 px-3 rounded-full">
        Click to view details
      </span>
    </div>
  </div>
);

const DietPlan = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activity_level: '',
    fitness_goal: '',
    diet_plan: true
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const apiUrl = 'http://localhost:8000/api/diet';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate form fields
    const requiredFields = ['weight', 'height', 'age', 'gender', 'activity_level', 'fitness_goal'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }
    
    // Prepare the payload with correct data types
    const payload = {
      ...formData,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      age: parseInt(formData.age, 10),
      diet_plan: Boolean(formData.diet_plan)
    };
    
    try {
      console.log("Sending payload:", JSON.stringify(payload));
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Make the API call - simplified to match the working version
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Parsed data:", data);
      setPlan(data);
    } catch (err) {
      console.error("API call failed:", err);
      setError(`Failed to generate diet plan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
      
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const openDayPlan = (day, meals) => {
    setSelectedDay({ day, meals });
  };

  const closeDayPlan = () => {
    setSelectedDay(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/home" className="inline-flex items-center text-white hover:text-purple-400 mb-8">
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Find Nutritional Requirements</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white mb-2">Activity Level</label>
                  <select
                    name="activity_level"
                    value={formData.activity_level}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select Activity Level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Activity</option>
                    <option value="moderate">Moderate Activity</option>
                    <option value="active">Very Active</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white mb-2">Fitness Goal</label>
                  <select
                    name="fitness_goal"
                    value={formData.fitness_goal}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select Goal</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="diet_plan"
                    checked={formData.diet_plan}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500/50 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  <span className="ms-3 text-sm font-medium text-white">Generate Diet Plan</span>
                  <InfoTooltip message="Toggle off to get only nutritional metrics without a full meal plan" />
                </label>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                {loading ? 'Calculating...' : formData.diet_plan ? 'Generate Diet Plan' : 'Calculate Nutrition'}
              </button>
            </div>
          </form>

          {plan && (
            <div className="mt-12 space-y-8">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Your Nutrition Metrics</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <MacroCard 
                    label="BMR" 
                    value={plan.bmr} 
                    unit=" kcal" 
                    bgColor="bg-indigo-600/30" 
                    textColor="text-indigo-300"
                  />
                  <MacroCard 
                    label="TDEE" 
                    value={plan.tdee} 
                    unit=" kcal" 
                    bgColor="bg-violet-600/30" 
                    textColor="text-violet-300"
                  />
                  <MacroCard 
                    label="BMI" 
                    value={plan.bmi} 
                    unit="" 
                    bgColor="bg-pink-600/30" 
                    textColor="text-pink-300"
                  />
                  <MacroCard 
                    label="Daily Calories" 
                    value={plan.daily_calories} 
                    unit=" kcal" 
                    bgColor="bg-purple-600/30" 
                    textColor="text-purple-300"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">Recommended Macros</h3>
                <div className="grid grid-cols-3 gap-4">
                  <MacroCard 
                    label="Protein" 
                    value={plan.macros.protein} 
                    unit="g" 
                    bgColor="bg-green-500/30" 
                    textColor="text-green-300"
                  />
                  <MacroCard 
                    label="Carbs" 
                    value={plan.macros.carbs} 
                    unit="g" 
                    bgColor="bg-blue-500/30" 
                    textColor="text-blue-300"
                  />
                  <MacroCard 
                    label="Fat" 
                    value={plan.macros.fat} 
                    unit="g" 
                    bgColor="bg-yellow-500/30" 
                    textColor="text-yellow-300"
                  />
                </div>
              </div>
              
              {plan.plan && (
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">Weekly Meal Plan</h2>
                  <p className="text-gray-300 mb-6">Click on a day to view the detailed meal plan:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(plan.plan).map(([day, meals]) => (
                      <DayCard 
                        key={day} 
                        day={day} 
                        meals={meals} 
                        onClick={openDayPlan}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {selectedDay && (
          <DayMealPlanDialog 
            day={selectedDay.day} 
            meals={selectedDay.meals} 
            onClose={closeDayPlan} 
          />
        )}
      </div>
    </div>
  );
};

export default DietPlan;