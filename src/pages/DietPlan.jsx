import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const DayMealPlanDialog = ({ day, meals, onClose }) => {
  if (!meals) return null;
  
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
          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
            <div key={mealType} className="bg-white/5 rounded-lg border border-white/10 p-4">
              <h4 className="text-lg font-semibold text-purple-400 capitalize mb-3">{mealType}</h4>
              
              <div className="mb-3">
                <p className="text-white text-lg mb-2">{meals[mealType].meal}</p>
              </div>
              
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="bg-purple-500/20 rounded-lg p-3 text-center">
                  <p className="text-sm text-purple-300 mb-1">Calories</p>
                  <p className="text-white font-bold">{meals[mealType].calories}</p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-300 mb-1">Carbs</p>
                  <p className="text-white font-bold">{meals[mealType].carbs}g</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-3 text-center">
                  <p className="text-sm text-green-300 mb-1">Protein</p>
                  <p className="text-white font-bold">{meals[mealType].protein}g</p>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                  <p className="text-sm text-yellow-300 mb-1">Fat</p>
                  <p className="text-white font-bold">{meals[mealType].fat}g</p>
                </div>
              </div>
            </div>
          ))}
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

const DayCard = ({ day, meals, onClick }) => (
  <div 
    className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all"
    onClick={() => onClick(day, meals)}
  >
    <h3 className="text-lg font-semibold text-white mb-3">{day}</h3>
    <div className="space-y-2">
      {Object.keys(meals).map(meal => (
        <div key={meal} className="flex justify-between text-sm">
          <span className="text-gray-400 capitalize">{meal}</span>
          <span className="text-gray-300 truncate max-w-[70%] text-right">{meals[meal].meal}</span>
        </div>
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
    fitness_goal: ''
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Convert string values to numbers
    const payload = {
      ...formData,
      weight: Number(formData.weight),
      height: Number(formData.height),
      age: Number(formData.age)
    };
    
    try {
      const response = await fetch('http://localhost:8000/api/diet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError('Error generating diet plan: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
        <Link to="/" className="inline-flex items-center text-white hover:text-purple-400 mb-8">
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Create Your Diet Plan</h1>
          
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
              
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                {loading ? 'Generating Plan...' : 'Generate Diet Plan'}
              </button>
            </div>
          </form>

          {plan && (
            <div className="mt-12 space-y-8">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Your Nutrition Summary</h2>
                
                <div className="grid grid-cols-4 gap-4">
                  <MacroCard 
                    label="Daily Calories" 
                    value={plan.daily_calories} 
                    unit=" kcal" 
                    bgColor="bg-purple-600/30" 
                    textColor="text-purple-300"
                  />
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