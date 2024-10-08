"use client";
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { SYMPTOM_CONDITION_RULES } from '../../lib/rules/evaluate'; // Pastikan ini diimpor dengan benar

/**
 * Komponen Hasil Diagnosa.
 * 
 * @returns {React.Element} Komponen yang merender hasil diagnosa.
 */

// Definisikan tipe data untuk hasil diagnosa
interface DiagnosisResult {
  [condition: string]: number; // Misal: { "Depresi": 3, "Kecemasan": 1 }
}

interface ResultWithSymptoms {
  computedResults: DiagnosisResult; // Hasil diagnosa yang dihitung
  selectedSymptoms: string[]; // Gejala yang dipilih pengguna
}

// Tentukan tipe untuk SUGGESTIONS (saran berdasarkan kondisi mental)
const SUGGESTIONS: Record<string, string> = {
  Depresi:
    "Cobalah untuk menjaga pola tidur yang teratur, melakukan aktivitas fisik secara rutin, dan berbagi perasaan Anda dengan orang yang Anda percayai. Terapi kognitif perilaku (CBT) serta konsultasi dengan psikolog atau psikiater sangat dianjurkan.",
  Kecemasan:
    "Latih teknik relaksasi seperti pernapasan dalam atau meditasi untuk mengurangi kecemasan. Hindari kafein berlebih, dan coba luangkan waktu untuk diri sendiri. Terapi berbicara juga dapat membantu mengatasi kecemasan berlebih.",
  OCD:
    "Cobalah untuk mengidentifikasi dan mencatat pemicu dari perilaku kompulsif. Terapi CBT sangat efektif untuk mengurangi pikiran obsesif dan perilaku kompulsif. Konsultasi dengan profesional kesehatan mental juga disarankan untuk terapi obat jika diperlukan.",
  "Gangguan Bipolar":
    "Jaga rutinitas harian Anda, termasuk pola tidur dan makan yang teratur. Hindari pemicu stres yang ekstrem, dan buatlah catatan suasana hati untuk membantu mengidentifikasi perubahan. Terapi obat-obatan dan konseling psikologis dapat membantu menjaga keseimbangan suasana hati.",
  Skizofrenia:
    "Terapi psikososial dan perawatan medis yang tepat dapat membantu mengelola gejala skizofrenia. Penting untuk mendukung kesehatan mental Anda dengan menjaga rutinitas, dukungan dari keluarga, dan pengawasan medis yang berkelanjutan.",
  "PTSD (Post-Traumatic Stress Disorder)":
    "Menghindari pemicu trauma tidak selalu efektif. Pertimbangkan untuk menjalani terapi pemrosesan kognitif atau terapi eksposur, yang dirancang untuk mengurangi gejala PTSD. Latihan mindfulness juga dapat membantu dalam mengatasi gejala PTSD sehari-hari.",
  "Gangguan Kepribadian Borderline":
    "Mengelola perubahan suasana hati bisa dilakukan dengan mindfulness atau terapi dialektik perilaku (DBT). Dukungan sosial dan terapi reguler dengan psikolog atau psikiater dapat sangat membantu mengurangi perilaku impulsif dan menstabilkan hubungan interpersonal.",
  "Eating disorder":
    "Konsultasi dengan ahli gizi serta terapi perilaku kognitif bisa membantu dalam memperbaiki hubungan Anda dengan makanan. Penting untuk menjaga kesehatan fisik dengan makan secara seimbang dan mendiskusikan kekhawatiran Anda dengan profesional kesehatan.",
  "ADHD (Attention-Deficit/Hyperactivity Disorder)":
    "Cobalah menggunakan teknik manajemen waktu, daftar tugas, dan catatan untuk mengatasi gejala ADHD. Terapi perilaku juga bisa membantu dalam mengatasi masalah perhatian. Jika perlu, konsultasikan dengan dokter untuk opsi pengobatan yang tersedia.",
};

// Definisikan warna untuk setiap kondisi
const conditionColors: Record<string, string> = {
  Depresi: "text-red-500",
  Kecemasan: "text-blue-500",
  OCD: "text-green-500",
  "Gangguan Bipolar": "text-purple-500",
  Skizofrenia: "text-indigo-500",
  PTSD: "text-yellow-500",
  "Gangguan Kepribadian Borderline": "text-pink-500",
  "Eating disorder": "text-orange-500",
  ADHD: "text-teal-500",
};

// Fungsi komponen utama untuk menampilkan hasil diagnosa
const Result = () => {
  const searchParams = useSearchParams(); // Mengambil parameter dari URL
  const results = searchParams.get('results'); // Mengambil hasil diagnosa dari query params

  // Jika tidak ada hasil, tampilkan pesan error
  if (!results) {
    return <div>Hasil diagnosa tidak ditemukan.</div>;
  }

  // Parsing hasil diagnosa menjadi format ResultWithSymptoms
  let parsedResults: ResultWithSymptoms;

  try {
    parsedResults = JSON.parse(results); // Parsing hasil diagnosa dari JSON
    console.log('Parsed results:', parsedResults); // Debug log
  } catch (error) {
    return <div>Format hasil diagnosa tidak valid.</div>; // Tangani kesalahan parsing
  }

  const { computedResults, selectedSymptoms } = parsedResults; // Destruktur hasil diagnosa

  // Mencari jumlah gejala tertinggi
  const maxSymptomCount = Math.max(...Object.values(computedResults));

  // Filter kondisi yang memiliki jumlah gejala sama dengan jumlah tertinggi
  const topConditions = Object.entries(computedResults)
    .filter(([_, count]) => count === maxSymptomCount)
    .map(([condition]) => condition);

  console.log('Top Conditions:', topConditions); // Debug log

  return (
    <div className="py-12 px-4 mx-auto">
      <div className="mt-8 text-center text-7xl text-black">
        <p>Hasil Diagnosa</p>
      </div>
      <div className="max-w-md mx-auto bg-[#215370] rounded-3xl md:max-w-2xl z-50">
        <div className="p-8 text-white">
          {Object.keys(computedResults).length > 0 ? (
            <div className="mt-8 border border-white p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Hasil Diagnosa Anda:</h2>
              {Object.entries(computedResults)
                .filter(([_, value]) => value > 0) // Tampilkan hanya kondisi dengan gejala yang valid
                .sort(([, a], [, b]) => b - a) // Urutkan dari gejala terbanyak
                .map(([condition, symptomCount]) => (
                  <div key={condition} className="mb-4">
                    {/* Tampilkan kondisi dan jumlah gejala */}
                    <span className={`font-medium ${conditionColors[condition] || 'text-white'}`}>
                      {condition} ({symptomCount} gejala)
                    </span>
                    <ul className="ml-4 mt-2 list-disc">
                      {selectedSymptoms
                        .filter((symptom) => 
                          SYMPTOM_CONDITION_RULES[condition]?.includes(symptom)
                        )
                        .map((symptom, index) => (
                          <li key={index} className="text-lg">
                            {symptom}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}

              <h2 className="text-xl font-bold mb-4 mt-6">
                Berdasarkan gejala Anda, ada kemungkinan Anda mengalami masalah mental berikut. Kami menyarankan konsultasi dengan psikiater terdekat. Saran berikut dapat membantu Anda mengatasi beberapa masalah:
              </h2>
              {topConditions.map((condition) => {
                const normalizedCondition = condition.trim(); // Normalisasi nama kondisi
                console.log('Checking suggestion for:', normalizedCondition); // Debug log

                // Ambil saran dari SUGGESTIONS berdasarkan kondisi
                const suggestion = SUGGESTIONS[normalizedCondition];

                console.log('Suggestion found:', suggestion); // Debug log

                return (
                  <div key={condition} className="mb-4">
                    <span className={`font-medium ${conditionColors[condition] || 'text-white'}`}>
                      {normalizedCondition}:
                    </span>
                    <div className="mt-2">
                      {suggestion || "Tidak ada saran yang tersedia untuk kondisi ini."}
                    </div>
                  </div>
                );
              })}
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
