import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRandomForest } from './services/RandomForestService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';

function App() {
  const { predict, status } = useRandomForest();
  const [page, setPage] = useState('home');
  const [prediction, setPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data for charts
  useEffect(() => {
    const metrics = {
      accuracy: 0.92,
      precision: 0.91,
      recall: 0.90,
      f1Score: 0.905,
      rocAuc: 0.96,
      confusionMatrix: { tp: 850, fp: 45, tn: 820, fn: 55 },
      topDiseases: [
        { name: 'Hypertension', count: 320, accuracy: 0.95, color: '#0088FE' },
        { name: 'Diabetes', count: 280, accuracy: 0.93, color: '#00C49F' },
        { name: 'Fever', count: 150, accuracy: 0.98, color: '#FFBB28' },
        { name: 'COVID-19', count: 95, accuracy: 0.87, color: '#FF8042' },
        { name: 'Hypothyroidism', count: 120, accuracy: 0.89, color: '#8884D8' }
      ]
    };
    setModelMetrics(metrics);
  }, []);

  // Home Page Component
  const HomePage = () => {
    const metricsData = modelMetrics ? [
      { name: 'Accuracy', value: modelMetrics.accuracy * 100, color: '#10B981' },
      { name: 'Precision', value: modelMetrics.precision * 100, color: '#3B82F6' },
      { name: 'Recall', value: modelMetrics.recall * 100, color: '#8B5CF6' },
      { name: 'F1 Score', value: modelMetrics.f1Score * 100, color: '#F59E0B' },
      { name: 'ROC AUC', value: modelMetrics.rocAuc * 100, color: '#EF4444' }
    ] : [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                  <span className="ml-3 text-xl font-bold text-gray-800 hidden sm:block">SwasthyaNirikha</span>
                  <span className="ml-3 text-xl font-bold text-gray-800 sm:hidden">SN AI</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button 
                  onClick={() => setPage('home')}
                  className="text-gray-700 hover:text-blue-600 px-2 sm:px-3 py-2 rounded-md text-sm sm:text-base font-medium"
                >
                  {isMobile ? 'Home' : 'Dashboard'}
                </button>
                <button 
                  onClick={() => setPage('predict')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow text-sm sm:text-base"
                >
                  {isMobile ? 'Predict' : 'Predict Disease'}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-10 text-center px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Medical Diagnosis Predictor
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
              AI-powered disease prediction with {modelMetrics ? Math.round(modelMetrics.accuracy * 100) : '92'}% accuracy
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-10">
            {[
              { label: 'Accuracy', value: `${(modelMetrics?.accuracy * 100).toFixed(1)}%`, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'blue' },
              { label: 'Total Cases', value: '1,770', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'green' },
              { label: 'Diseases', value: '24', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'purple' },
              { label: 'Avg Time', value: '1.2s', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'red' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6">
                <div className="flex items-center">
                  <div className={`p-2 sm:p-3 ${stat.color === 'blue' ? 'bg-blue-100' : stat.color === 'green' ? 'bg-green-100' : stat.color === 'purple' ? 'bg-purple-100' : 'bg-red-100'} rounded-lg sm:rounded-xl mr-2 sm:mr-4`}>
                    <svg className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : stat.color === 'purple' ? 'text-purple-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-10">
            {/* Performance Chart */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                <span className="w-2 h-4 sm:h-6 bg-blue-600 rounded-full mr-2 sm:mr-3 inline-block"></span>
                {isMobile ? 'Performance' : 'Model Performance'}
              </h3>
              <div className="h-48 sm:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricsData} margin={isMobile ? { top: 10, right: 10, left: -20, bottom: 10 } : { top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={isMobile ? 10 : 12} />
                    <YAxis stroke="#6B7280" fontSize={isMobile ? 10 : 12} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Score']} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {metricsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Disease Distribution - Hide on very small screens */}
            {!isMobile && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  <span className="w-2 h-4 sm:h-6 bg-purple-600 rounded-full mr-2 sm:mr-3 inline-block"></span>
                  Disease Distribution
                </h3>
                <div className="h-48 sm:h-64 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={modelMetrics?.topDiseases}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={isMobile ? 60 : 80}
                        innerRadius={isMobile ? 30 : 40}
                        dataKey="count"
                      >
                        {modelMetrics?.topDiseases.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Ready to Predict?
            </h2>
            <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">
              Get instant AI-powered disease prediction with detailed insights.
            </p>
            <button
              onClick={() => setPage('predict')}
              className="bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:shadow-xl"
            >
              Start Predicting {!isMobile && 'Now'} →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Prediction Page Component
  const PredictPage = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    
    const symptomsData = [
      { id: 1, name: 'Fever' },
      { id: 2, name: 'Cough' },
      { id: 3, name: 'Headache' },
      { id: 4, name: 'Thirst' },
      { id: 5, name: 'Body Pain' },
      { id: 6, name: 'Frequent Urination' },
      { id: 7, name: 'Dizziness' },
      { id: 8, name: 'Fatigue' },
      { id: 9, name: 'Chills' },
      { id: 10, name: 'Weakness' },
      { id: 11, name: 'Weight Loss' },
      { id: 12, name: 'Breathing Difficulty' },
      { id: 13, name: 'Dry Mouth' },
      { id: 14, name: 'Fainting' },
      { id: 15, name: 'Low Activity' },
      { id: 16, name: 'Chest Pain' }
    ];

    // Symptoms state
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [symptomsError, setSymptomsError] = useState('');

    // Filter symptoms based on search
    const filteredSymptoms = symptomsData.filter(symptom =>
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle symptom selection
    const handleSymptomSelect = (symptom) => {
      if (selectedSymptoms.some(s => s.id === symptom.id)) {
        setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptom.id));
      } else {
        setSelectedSymptoms([...selectedSymptoms, symptom]);
      }
      setSymptomsError('');
    };

    // Remove selected symptom
    const removeSymptom = (symptomId) => {
      setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== symptomId));
    };

    // Clear all symptoms
    const clearAllSymptoms = () => {
      setSelectedSymptoms([]);
      setSymptomsError('');
    };

    const onSubmit = async (data) => {
      if (!status.loaded) {
        alert('Model is still loading. Please wait...');
        return;
      }
      
      // Validate symptoms
      if (selectedSymptoms.length === 0) {
        setSymptomsError('Please select at least one symptom');
        return;
      }
      
      setLoadingPrediction(true);
      setPrediction(null);
      
      try {
        // Prepare form data with symptoms
        const formData = {
          ...data,
          symptoms: selectedSymptoms.map(s => s.id)
        };
        
        console.log('Submitting form data:', formData);
        
        const result = predict(formData);
        
        // Format result for UI
        const formattedPrediction = {
          disease: result.disease,
          confidence: result.confidence,
          treeCount: result.treeCount,
          probabilities: result.probabilities,
          diseases: result.diseases,
          recommendations: getRecommendations(result.disease),
          risk_level: getRiskLevel(result.disease)
        };
        
        setPrediction(formattedPrediction);
        
      } catch (error) {
        console.error('Prediction error:', error);
        alert('Prediction failed: ' + error.message);
      } finally {
        setLoadingPrediction(false);
      }
    };

    // Helper functions
    const getRecommendations = (disease) => {
      const recommendations = {
        'Hypertension': [
          "Monitor blood pressure twice daily",
          "Reduce sodium intake to <1500mg/day",
          "Consult cardiologist within 48 hours"
        ],
        'Diabetes': [
          "Check fasting blood sugar levels",
          "Follow diabetic diet plan",
          "Consult endocrinologist"
        ],
        'Viral_Fever': [
          "Get plenty of rest",
          "Stay hydrated",
          "Take antipyretics if needed"
        ],
        'Cardiac_Risk': [
          "Immediate ECG recommended",
          "Avoid strenuous activity",
          "Emergency consultation needed"
        ],
        'Anemia': [
          "Increase iron-rich foods in diet",
          "Consider iron supplements",
          "Consult hematologist"
        ],
        'Respiratory_Infection': [
          "Rest and stay hydrated",
          "Use humidifier",
          "Consult if symptoms worsen"
        ],
        'Hypotension': [
          "Increase salt intake moderately",
          "Stay hydrated",
          "Avoid sudden position changes"
        ],
        'Malnutrition': [
          "Balanced diet with proper nutrients",
          "Consult nutritionist",
          "Regular health check-ups"
        ],
        'Obesity_Risk': [
          "Regular exercise regimen",
          "Balanced calorie-controlled diet",
          "Consult dietitian"
        ]
      };
      
      return recommendations[disease] || [
        "Consult healthcare provider",
        "Monitor your symptoms",
        "Follow up if condition worsens"
      ];
    };

    const getRiskLevel = (disease) => {
      const highRisk = ['Cardiac_Risk', 'Hypertension'];
      const mediumRisk = ['Diabetes', 'Respiratory_Infection'];
      
      if (highRisk.includes(disease)) return 'High';
      if (mediumRisk.includes(disease)) return 'Medium';
      return 'Low';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button 
                  onClick={() => setPage('home')}
                  className="flex items-center text-gray-700 hover:text-blue-600 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {isMobile ? 'Back' : 'Back to Dashboard'}
                </button>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-800">{isMobile ? 'Predict' : 'Predict Disease'}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Patient Diagnosis Predictor
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Enter patient vitals for AI-powered diagnosis
            </p>
          </div>

          {/* Model Status */}
          <div className={`mb-6 p-4 rounded-lg ${status.loaded ? 'bg-green-100' : status.loading ? 'bg-yellow-100' : 'bg-red-100'}`}>
            {status.loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
                <span>Downloading AI model: {status.progress}%</span>
                <div className="ml-4 w-48 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${status.progress}%` }}></div>
                </div>
              </div>
            ) : status.loaded ? (
              <div className="flex items-center text-green-800">
                <span className="mr-2">✓</span>
                <span>AI Model ready! Running locally on your device.</span>
              </div>
            ) : (
              <div className="text-red-800">
                ⚠️ Model failed to load: {status.error}
              </div>
            )}
          </div>
            {/* Offline Status */}
{status.isOffline && (
  <div className="mb-4 p-3 rounded-lg bg-blue-100 border border-blue-300">
    <div className="flex items-center text-blue-800">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
      </svg>
      <span>Working offline with cached model</span>
    </div>
  </div>
)}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Form Section */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  {/* Row 1: Age & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Age (years)*
                      </label>
                      <input
                        type="number"
                        {...register('age', { 
                          required: 'Age is required',
                          min: { value: 0, message: 'Age must be positive' },
                          max: { value: 120, message: 'Age must be less than 120' }
                        })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 35"
                      />
                      {errors.age && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.age.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Gender*
                      </label>
                      <select
                        {...register('gender', { required: 'Gender is required' })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Blood Pressure Section */}
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3">
                      Blood Pressure (mm Hg)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP*</label>
                        <input
                          type="number"
                          {...register('systolic', { 
                            required: 'Systolic BP is required',
                            min: { value: 50, message: 'Systolic BP must be at least 50' },
                            max: { value: 250, message: 'Systolic BP must be less than 250' }
                          })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 120"
                        />
                        {errors.systolic && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.systolic.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP*</label>
                        <input
                          type="number"
                          {...register('diastolic', { 
                            required: 'Diastolic BP is required',
                            min: { value: 30, message: 'Diastolic BP must be at least 30' },
                            max: { value: 150, message: 'Diastolic BP must be less than 150' }
                          })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 80"
                        />
                        {errors.diastolic && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.diastolic.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)*</label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('temp', { 
                          required: 'Temperature is required',
                          min: { value: 34, message: 'Temperature must be at least 34°C' },
                          max: { value: 42, message: 'Temperature must be less than 42°C' }
                        })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 36.6"
                      />
                      {errors.temp && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.temp.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)*</label>
                      <input
                        type="number"
                        {...register('heartRate', { 
                          required: 'Heart rate is required',
                          min: { value: 40, message: 'Heart rate must be at least 40 bpm' },
                          max: { value: 200, message: 'Heart rate must be less than 200 bpm' }
                        })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 72"
                      />
                      {errors.heartRate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.heartRate.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Sugar (mg/dL)*</label>
                      <input
                        type="number"
                        {...register('bloodSugar', { 
                          required: 'Blood sugar is required',
                          min: { value: 50, message: 'Blood sugar must be at least 50 mg/dL' },
                          max: { value: 500, message: 'Blood sugar must be less than 500 mg/dL' }
                        })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 95"
                      />
                      {errors.bloodSugar && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.bloodSugar.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* BMI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BMI (kg/m²)*</label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('bmi', { 
                        required: 'BMI is required',
                        min: { value: 10, message: 'BMI must be at least 10' },
                        max: { value: 50, message: 'BMI must be less than 50' }
                      })}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 22.5"
                    />
                    {errors.bmi && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.bmi.message}
                      </p>
                    )}
                  </div>

                  {/* Symptoms Section - FIXED */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Symptoms*
                      </span>
                    </label>

                    {/* Selected Symptoms Display */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {selectedSymptoms.map(symptom => (
                          <div
                            key={symptom.id}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200"
                          >
                            <span className="text-sm font-medium text-blue-800 mr-2">{symptom.name}</span>
                            <button
                              type="button"
                              onClick={() => removeSymptom(symptom.id)}
                              className="text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        {selectedSymptoms.length === 0 && (
                          <div className="text-gray-400 text-sm py-2">
                            No symptoms selected. Click to select from common symptoms.
                          </div>
                        )}
                      </div>
                      
                      {selectedSymptoms.length > 0 && (
                        <button
                          type="button"
                          onClick={clearAllSymptoms}
                          className="text-sm text-red-600 hover:text-red-800 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Search and Dropdown */}
                    <div className="relative">
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Search symptoms..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={() => setIsDropdownOpen(true)}
                          className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-r-lg hover:opacity-90"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isDropdownOpen ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            )}
                          </svg>
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className={`absolute z-10 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 ${isMobile ? 'max-h-48' : 'max-h-64'} overflow-y-auto custom-scrollbar`}>
                          <div className="p-2">
                            {/* Popular Symptoms Quick Select */}
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">QUICK SELECT</div>
                              <div className="flex flex-wrap gap-2">
                                {['Fever', 'Cough', 'Headache', 'Fatigue'].map(symptomName => {
                                  const symptom = symptomsData.find(s => s.name === symptomName);
                                  const isSelected = selectedSymptoms.some(s => s.id === symptom?.id);
                                  return (
                                    <button
                                      key={symptomName}
                                      type="button"
                                      onClick={() => symptom && handleSymptomSelect(symptom)}
                                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isSelected
                                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                      {symptomName}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* All Symptoms List */}
                            <div className="space-y-1">
                              {filteredSymptoms.map(symptom => {
                                const isSelected = selectedSymptoms.some(s => s.id === symptom.id);
                                return (
                                  <div
                                    key={symptom.id}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors symptom-item ${isSelected
                                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                                        : 'hover:bg-gray-50'
                                      }`}
                                    onClick={() => handleSymptomSelect(symptom)}
                                  >
                                    <div className="flex items-center">
                                      <div className={`w-3 h-3 rounded-full mr-3 ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                      <div className="font-medium text-gray-800">{symptom.name}</div>
                                    </div>
                                    {isSelected ? (
                                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      <button className="text-gray-400 hover:text-blue-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* No Results */}
                            {filteredSymptoms.length === 0 && (
                              <div className="p-4 text-center text-gray-500">
                                No symptoms found matching "{searchTerm}"
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selected Symptoms Count and Error */}
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        {isDropdownOpen ? 'Hide symptoms' : 'Show all symptoms'}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Symptoms Error Message */}
                    {symptomsError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {symptomsError}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={!status.loaded || loadingPrediction}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 sm:px-6 rounded-lg font-bold hover:shadow-xl disabled:opacity-50 flex-1 flex items-center justify-center gap-2"
                    >
                      {loadingPrediction ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          {isMobile ? 'Analyzing...' : 'Analyzing Data...'}
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {isMobile ? 'Predict' : 'Predict Disease'}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        setSelectedSymptoms([]);
                        setSearchTerm('');
                        setSymptomsError('');
                      }}
                      className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex-1 sm:flex-none"
                    >
                      {isMobile ? 'Clear' : 'Clear Form'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                  Prediction Results
                </h2>

                {prediction ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Disease Card */}
                    <div className="p-4 sm:p-6 rounded-xl text-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        {prediction.disease.replace('_', ' ')}
                      </div>
                      <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-white rounded-full">
                        <span className="font-bold text-gray-800 text-sm sm:text-base">
                          Confidence: {(prediction.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Based on {prediction.treeCount} decision trees running locally
                      </div>
                    </div>

                    {/* All Probabilities */}
                    <div className="bg-white p-3 sm:p-5 rounded-xl border">
                      <h3 className="font-bold text-gray-700 mb-3">All Probabilities</h3>
                      <div className="space-y-3">
                        {prediction.probabilities.map((prob, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                {prediction.diseases?.[idx]?.replace('_', ' ') || `Disease ${idx + 1}`}
                              </span>
                              <span className="font-bold text-blue-600">{(prob * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${prob * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-blue-50 p-3 sm:p-5 rounded-xl">
                      <h3 className="font-bold text-blue-800 mb-2 sm:mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {prediction.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-blue-800 text-sm sm:text-base flex items-start">
                            <span className="mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risk Level */}
                    <div className="p-3 sm:p-5 rounded-xl border">
                      <h3 className="font-bold text-gray-700 mb-3">Risk Assessment</h3>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Risk Level</span>
                          <span className={`font-bold ${prediction.risk_level === 'High' ? 'text-red-600' : prediction.risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {prediction.risk_level}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${prediction.risk_level === 'High' ? 'bg-red-500 w-full' : prediction.risk_level === 'Medium' ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-1/3'}`}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setPrediction(null);
                        reset();
                        setSelectedSymptoms([]);
                        setSymptomsError('');
                      }}
                      className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      New Prediction
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-300 mb-4">
                      <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                      Awaiting Analysis
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Fill the form to get AI-powered diagnosis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-800 text-xs sm:text-sm">
              ⚠️ <strong>Disclaimer:</strong> For informational purposes only. Consult healthcare providers for medical concerns.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {page === 'home' ? <HomePage /> : <PredictPage />}
    </div>
  );
}

export default App;