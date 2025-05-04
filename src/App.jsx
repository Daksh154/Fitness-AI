import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WorkoutPlan from './pages/WorkoutPlan';
import DietPlan from './pages/DietPlan';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Routes>
          <Route path = "/signin" element={<LoginPage />} />
          <Route path = "/signup" element={<SignupPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/workout" element={<WorkoutPlan />} />
          <Route path="/diet" element={<DietPlan />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;