"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import React from 'react';

/**
 * Hasil Diagnosa Component.
 * 
 * @returns {React.Element} The rendered Result component.
 */

// Definisikan tipe data untuk hasil diagnosa
interface DiagnosisResult {
  [condition: string]: number; // Contoh: { "Depresi": 3, "Kecemasan": 1 }
}

const Result = () => {
  const searchParams = useSearchParams();
  const results = searchParams.get('results');

  // Jika tidak ada hasil, tampilkan pesan error
  if (!results) {
    return <div>Hasil diagnosa tidak ditemukan.</div>;
  }

  // Parsing hasil menjadi DiagnosisResult
  let parsedResults: DiagnosisResult;

  try {
    parsedResults = JSON.parse(results);
    console.log('Parsed results:', parsedResults); // Debug log
  } catch (error) {
    return <div>Format hasil diagnosa tidak valid.</div>; // Tangani kesalahan saat parsing JSON
  }

  return (
    <div className="py-12 px-4 mx-auto">
      <div className="mt-8 text-center text-7xl text-black">
        <p>Hasil Diagnosa</p>
      </div>
      <div className="max-w-md mx-auto bg-[#215370] rounded-3xl md:max-w-2xl z-50">
        <div className="p-8 text-white">
          {Object.keys(parsedResults).length > 0 ? (
            <div className="mt-8 border border-white p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Hasil Diagnosa Anda:</h2>
              {Object.entries(parsedResults)
                .filter(([_, value]) => value > 0) // Pastikan hanya kondisi dengan gejala yang valid ditampilkan
                .sort(([, a], [, b]) => b - a)
                .map(([condition, symptomCount]) => (
                  <div key={condition} className="mb-4">
                    <span className="font-medium">
                      {condition} ({symptomCount} gejala)
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div>Hasil diagnosa tidak menunjukkan gejala.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
