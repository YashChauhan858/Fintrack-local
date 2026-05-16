const ResetBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-sm border border-[#2A3441] bg-[#151B23] hover:bg-[#1B2430] active:scale-[0.98] transition-all duration-200 text-sm font-medium text-[#D6E1FF]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 2v6h6" />
        <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
        <path d="M21 22v-6h-6" />
        <path d="M3 12a9 9 0 0 0 15 6.7L21 16" />
      </svg>
    </button>
  );
};

export default ResetBtn;
