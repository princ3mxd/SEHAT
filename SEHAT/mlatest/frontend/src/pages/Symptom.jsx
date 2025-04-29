import { useState } from "react";
import { useAIStore } from "../store/ai.store.js";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const { aiResponse, checkSymptoms, loading, error } = useAIStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symptoms.trim() === "") return alert("Please enter symptoms");
    checkSymptoms(symptoms);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI Symptom Checker</h1>
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="w-full lg:w-3/5">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="symptoms"
                  className="block text-xl font-semibold mb-4 text-gray-800"
                >
                  Describe your symptoms in detail:
                </label>
                <textarea
                  id="symptoms"
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[200px] text-lg"
                  placeholder="Example: I've been experiencing headaches and fever since yesterday..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !symptoms.trim()}
                className={`w-full py-4 rounded-lg text-white font-medium text-lg transition-colors
                  ${loading || !symptoms.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'}`}
              >
                {loading ? 'Analyzing...' : 'Check Symptoms'}
              </button>
            </form>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {aiResponse && (
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Analysis Result:</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg whitespace-pre-line">
                  {aiResponse}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/5">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <img
                src="https://www.tech2b.at/media/tech2b_Logo_Symptoma.png"
                alt="Symptom Checker"
                className="w-full h-auto rounded-lg mb-6 object-contain"
              />
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">How it works</h3>
                <p className="text-gray-600">
                  Our AI analyzes your symptoms and provides potential insights based on medical knowledge.
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                ⚠️ Important Disclaimer
              </h3>
              <div className="space-y-3 text-orange-700">
                <p>
                  This AI symptom checker is for informational purposes only and should not be considered as medical advice.
                </p>
                <p>
                  Always consult with qualified healthcare professionals for:
                </p>
                <ul className="list-disc list-inside">
                  <li>Proper medical diagnosis</li>
                  <li>Treatment recommendations</li>
                  <li>Emergency medical conditions</li>
                  <li>Persistent or severe symptoms</li>
                </ul>
                <p className="font-medium">
                  If you're experiencing a medical emergency, please call your local emergency services immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
