"use client";

export default function ReportExport({ trackName }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      id="export-report-btn"
      className="no-print flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm 
                 transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(192,132,252,0.15))",
        border: "1px solid rgba(124,58,237,0.4)",
        color: "#C084FC",
      }}
      title="Save as PDF or print your report"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Export Report
    </button>
  );
}
