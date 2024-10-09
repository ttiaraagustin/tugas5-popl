"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SYMPTOM_CONDITION_RULES, evaluateRules } from "../lib/rules/evaluate";
import FloatingSVGs from "./component/FloatingSVG";

const Diagnosis: React.FC = () => {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const symptoms = Object.values(SYMPTOM_CONDITION_RULES).flat();

  const symptomsPerPage = 10;
  const totalPages = Math.ceil(symptoms.length / symptomsPerPage);
  const currentSymptoms = symptoms.slice(
    page * symptomsPerPage,
    (page + 1) * symptomsPerPage
  );

  const handleCheckboxChange = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms((prev) => prev.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms((prev) => [...prev, symptom]);
    }
  };

  const handleSubmit = () => {
    console.log('Diagnosa button clicked'); // Debugging log
    if (selectedSymptoms.length > 0) {
      const computedResults = evaluateRules(selectedSymptoms);
      const resultWithSymptoms = {
        computedResults,
        selectedSymptoms,
      };

      const resultsQuery = JSON.stringify(resultWithSymptoms);
      router.push(`/result?results=${encodeURIComponent(resultsQuery)}`);
    } else {
      alert("Silakan pilih gejala terlebih dahulu.");
    }
  };

  return (
    <div className="py-12 px-4 mx-auto">
      <div className="mt-8 text-center text-7xl text-gray-700">
        <p>Sistem Pakar Gangguan</p>
        <p>Kesehatan Mental</p>
      </div>
      <div className="max-w-md mx-auto bg-[#1D3C45] rounded-3xl md:max-w-2xl z-50">
        <div className="mt-8 p-4 text-center text-2xl text-white">
          Pilih gejala yang Anda rasakan (Halaman {page + 1}/{totalPages})
        </div>
        <div className="p-8 text-white">
          <form className="space-y-4" id="diagnosis-form">
            {currentSymptoms.map((symptom, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={symptom}
                  value={symptom}
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleCheckboxChange(symptom)}
                  className="form-checkbox text-teal-500 h-5 w-5"
                />
                <label htmlFor={symptom} className="text-xl">
                  {symptom}
                </label>
              </div>
            ))}
          </form>
          <div className="mt-4 flex flex-col items-center">
            <div className="flex justify-between w-full">
              {page > 0 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                >
                  Kembali
                </button>
              )}
              {page < totalPages - 1 && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 ml-auto"
                >
                  Selanjutnya
                </button>
              )}
            </div>
            {page === totalPages - 1 && (
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-gradient-to-r from-white to-gray-200 text-black rounded-full hover:from-gray-50 hover:to-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                onClick={handleSubmit}
              >
                Diagnosa
              </button>
            )}
          </div>
        </div>
      </div>
      <FloatingSVGs />
    </div>
  );
};

export default Diagnosis;
