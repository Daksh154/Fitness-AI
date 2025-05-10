import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkoutPlan = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Convert string values to numbers before sending to the backend
    const processedData = {
      ...formData,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      age: parseInt(formData.age, 10)
    };
    
    try {
      const response = await fetch('http://localhost:8000/api/workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(processedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setPlan(data);
    } catch (err) {
      setError('Error generating workout plan: ' + err.message);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-white hover:text-purple-400 mb-8">
        <ArrowLeft className="mr-2" /> Back to Home
      </Link>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Create Your Workout Plan</h1>
        
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
              {loading ? 'Generating Plan...' : 'Generate Workout Plan'}
            </button>
          </div>
        </form>

        {plan && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Your Workout Plan</h2>
            
            {plan.plan && (
              <div className="space-y-6">
                {Object.entries(plan.plan).map(([day, workout]) => (
                  <div key={day} className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">{day}</h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-gray-300"><span className="text-purple-400">Type:</span> {workout.type}</p>
                      <p className="text-gray-300"><span className="text-purple-400">Duration:</span> {workout.duration}</p>
                      <p className="text-gray-300"><span className="text-purple-400">Intensity:</span> {workout.intensity}</p>
                      
                      {workout.exercises && workout.exercises.length > 0 && (
                        <div className="mt-3">
                          <p className="text-purple-400 font-medium">Exercises:</p>
                          <ul className="mt-1 space-y-1">
                            {workout.exercises.map((exercise, index) => (
                              <li key={index} className="text-gray-300">
                                {exercise.name} {exercise.sets && exercise.reps ? 
                                  `- ${exercise.sets} sets × ${exercise.reps} reps` : 
                                  exercise.duration ? `- ${exercise.duration}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {workout.rest_period && (
                        <p className="text-gray-300"><span className="text-purple-400">Rest:</span> {workout.rest_period}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!plan.plan && (
              <pre className="text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(plan, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlan;