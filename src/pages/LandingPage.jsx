import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Utensils } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-white mb-12 text-center">
        Transform Your Life
      </h1>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div
          onClick={() => navigate('/workout')}
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 shadow-xl hover:shadow-purple-500/20">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30">
                <Dumbbell size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Workout</h2>
              <p className="text-gray-300">
                Get a personalized workout plan based on your fitness goals
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/diet')}
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 shadow-xl hover:shadow-purple-500/20">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30">
                <Utensils size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Diet</h2>
              <p className="text-gray-300">
                Receive a customized diet plan to achieve your goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;