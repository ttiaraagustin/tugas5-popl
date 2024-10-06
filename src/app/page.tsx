"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RuleBasedResults,
  SYMPTOM_CONDITION_RULES,
  evaluateRules,
} from "../lib/rules/evaluate";
import FloatingSVGs from "./component/FloatingSVG";

/**
 * Diagnosis Component.
 *
 * @returns {React.Element} The rendered Diagnosis component.
 */
const Diagnosis: React.FC = () => {
  const router = useRouter();
  const [results, setResults] = useState<RuleBasedResults | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]); // State untuk menyimpan gejala yang dipilih
  const [page, setPage] = useState(0); // State untuk melacak halaman saat ini
  const symptoms = Object.values(SYMPTOM_CONDITION_RULES).flat();

  // Fungsi untuk mendapatkan gejala yang relevan untuk halaman saat ini
  const symptomsPerPage = 10;
  const totalPages = Math.ceil(symptoms.length / symptomsPerPage);
  const currentSymptoms = symptoms.slice(
    page * symptomsPerPage,
    (page + 1) * symptomsPerPage
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const answers = symptoms.filter((symptom) => form[symptom].checked);

    if (answers.length === 0) {
      alert("Pilih setidaknya satu gejala sebelum melakukan diagnosa.");
      return;
    }

    const computedResults = evaluateRules(answers);
    setResults(computedResults);
    setSelectedSymptoms(answers); // Simpan gejala yang dipilih ke state

    // Menggabungkan hasil diagnosa dan gejala yang dipilih
    const resultWithSymptoms = {
      computedResults,
      selectedSymptoms: answers,
    };

    // Mengirim hasil ke halaman hasil
    const resultsQuery = JSON.stringify(resultWithSymptoms);
    router.push(`/result?results=${encodeURIComponent(resultsQuery)}`);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="py-12 px-4 mx-auto">
      <div className="mt-8 text-center text-7xl text-gray-700 ">
        <p>Sistem Pakar Gangguan</p>
        <p>Kesehatan Mental</p>
      </div>
      <div className="max-w-md mx-auto bg-[#1D3C45] rounded-3xl md:max-w-2xl z-50">
        <div className="mt-8 p-4 text-center text-2xl text-white">
          Pilihlah diagnosa yang anda rasakan (Halaman {page + 1}/{totalPages})
        </div>
        <div className="p-8 text-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentSymptoms.map((symptom, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={symptom}
                  name={symptom}
                  className="form-checkbox text-teal-500 h-5 w-5"
                />
                <label htmlFor={symptom} className="text-xl">
                  {symptom}
                </label>
              </div>
            ))}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={page === 0}
                className={`mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 ${page === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Kembali
              </button>
              {page < totalPages - 1 ? (
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:from-emerald-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                >
                  Diagnosa
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <FloatingSVGs />
    </div>
  );
};

export default Diagnosis;
