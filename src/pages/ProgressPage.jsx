import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import config from "../config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressPage = () => {
  const [progressData, setProgressData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: "",
    bmi: "",
    steps: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchProgressData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${config.apiUrl}/api/progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProgressData(response.data.data);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `${config.apiUrl}/api/progress`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowForm(false);
      setFormData({ weight: "", bmi: "", steps: "" });
      fetchProgressData();
    } catch (error) {
      console.error("Error submitting progress:", error);
    }
  };

  const chartData = {
    labels: progressData.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: "Weight (kg)",
        data: progressData.map((item) => item.weight),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "BMI",
        data: progressData.map((item) => item.bmi),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Steps",
        data: progressData.map((item) => item.steps),
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Progress Tracking",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/home" className="flex items-center text-purple-300 hover:text-white mb-8 group">
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Progress Tracking</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {showForm ? "Cancel" : "Add Progress"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">BMI</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.bmi}
                    onChange={(e) =>
                      setFormData({ ...formData, bmi: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Steps</label>
                  <input
                    type="number"
                    required
                    value={formData.steps}
                    onChange={(e) =>
                      setFormData({ ...formData, steps: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Save Progress
              </button>
            </form>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 