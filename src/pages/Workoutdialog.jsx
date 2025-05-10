import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, Dumbbell, ChevronDown, ChevronUp, User, Calendar, Plus, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

// WorkoutHistory Component - Shows previous workout plans
const WorkoutHistory = ({ onSelectPlan, shouldRefresh }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    fetchWorkoutHistory();
  }, [shouldRefresh]);

  const fetchWorkoutHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/workout/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setHistory(data.plans);
    } catch (err) {
      setError('Failed to load workout history');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId) => {
    onSelectPlan(planId);
    setExpanded(false);
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-300">Loading history...</div>;
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <History className="mr-2 text-purple-400" size={20} />
          <h3 className="font-semibold text-white">Workout History</h3>
        </div>
        <div className="flex items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent toggling expanded state
              fetchWorkoutHistory();
            }}
            className="mr-3 p-1 rounded-full hover:bg-white/10 transition"
            title="Refresh history"
          >
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {expanded ? (
            <ChevronUp className="text-purple-400" size={18} />
          ) : (
            <ChevronDown className="text-purple-400" size={18} />
          )}
        </div>
      </div>

      {expanded && (
        <div className="p-4 pt-0 border-t border-white/10">
          {error && (
            <div className="flex items-center p-3 mb-3 rounded bg-red-500/10 text-red-400 text-sm">
              <AlertTriangle size={16} className="mr-2" />
              {error}
            </div>
          )}

          {history.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No previous workout plans found
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.map((plan) => (
                <div 
                  key={plan.id} 
                  className="bg-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-white/10 transition cursor-pointer"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  <div className="flex items-center">
                    <Dumbbell className="mr-2 text-purple-400" size={16} />
                    <div>
                      <p className="text-white text-sm font-medium">
                        {plan.fitness_goal ? plan.fitness_goal.replace('_', ' ').charAt(0).toUpperCase() + plan.fitness_goal.replace('_', ' ').slice(1) : 'Workout Plan'}
                      </p>
                      <p className="text-xs text-gray-400">
                        <Calendar size={12} className="inline mr-1" />
                        {new Date(plan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// WorkoutForm Component - For inputting user data
const WorkoutForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activity_level: '',
    fitness_goal: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center mb-6">
          <User className="mr-2 text-purple-400" size={20} />
          <h2 className="text-xl font-semibold text-white">Enter Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white mb-2 text-sm">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-2 text-sm">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-2 text-sm">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-2 text-sm">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white mb-2 text-sm">Activity Level</label>
            <select
              name="activity_level"
              value={formData.activity_level}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
            <label className="block text-white mb-2 text-sm">Fitness Goal</label>
            <select
              name="fitness_goal"
              value={formData.fitness_goal}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Plan...
            </>
          ) : (
            <>
              <Plus className="mr-2" size={18} />
              Generate New Workout Plan
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// WorkoutPlanDisplay Component - Shows the generated plan
const WorkoutPlanDisplay = ({ plan }) => {
  if (!plan) return null;
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Dumbbell className="mr-3 text-purple-400" />
        Your Workout Plan
      </h2>
      
      {plan.plan && (
        <div className="space-y-6">
          {Object.entries(plan.plan).map(([day, workout]) => (
            <div key={day} className="bg-white/5 p-5 rounded-lg border border-white/10 transition hover:border-purple-500/30">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <span className="inline-block w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
                  {day.charAt(0)}
                </span>
                {day}
              </h3>
              
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-gray-400 text-xs">Type</p>
                    <p className="text-white font-medium">{workout.type}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-gray-400 text-xs">Duration</p>
                    <p className="text-white font-medium">{workout.duration}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-gray-400 text-xs">Intensity</p>
                    <p className="text-white font-medium">{workout.intensity}</p>
                  </div>
                </div>
                
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="mt-4">
                    <p className="text-purple-400 font-medium mb-2">Exercises:</p>
                    <div className="space-y-2">
                      {workout.exercises.map((exercise, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                          <div className="text-white font-medium">
                            {exercise.name}
                          </div>
                          <div className="text-gray-300 text-sm">
                            {exercise.sets && exercise.reps ? 
                              `${exercise.sets} sets × ${exercise.reps} reps` : 
                              exercise.duration ? `${exercise.duration}` : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {workout.rest_period && (
                  <div className="mt-3 text-gray-300 text-sm bg-white/5 p-3 rounded-lg">
                    <span className="text-purple-400 font-medium">Rest:</span> {workout.rest_period}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!plan.plan && (
        <pre className="text-gray-300 whitespace-pre-wrap bg-white/5 p-4 rounded-lg border border-white/10 overflow-auto">
          {JSON.stringify(plan, null, 2)}
        </pre>
      )}
    </div>
  );
};

export { WorkoutHistory, WorkoutForm, WorkoutPlanDisplay };