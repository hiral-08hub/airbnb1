import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  return (
    <div className="w-full flex justify-center mt-8 px-4">
      <div
        className="
        cursor-pointer
          flex items-center
          bg-white
          rounded-full
          h-[64px]
          w-full
          max-w-4xl
          border border-gray-200
          shadow-[0_12px_30px_rgba(0,0,0,0.15)]
          hover:shadow-[0_18px_40px_rgba(0,0,0,0.2)]
          hover:-translate-y-[2px]
          transition-all duration-300
        "
      >
        {/* WHERE */}
        <div className="flex-1 px-6">
          <p className="text-[12px] font-semibold text-black">
            Where
          </p>
          <p className="text-[14px] text-gray-500">
            Search destinations
          </p>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        {/* WHEN */}
        <div className="flex-1 px-6">
          <p className="text-[12px] font-semibold text-black">
            When
          </p>
          <p className="text-[14px] text-gray-500">
            Add dates
          </p>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        {/* WHO */}
        <div className="flex-1 px-6">
          <p className="text-[12px] font-semibold text-black">
            Who
          </p>
          <p className="text-[14px] text-gray-500">
            Add guests
          </p>
        </div>

        {/* SEARCH ICON */}
        <div className="pr-2">
          <button
            className="
            cursor-pointer
              bg-[#FF385C]
              h-12
              w-12
              rounded-full
              flex
              items-center
              justify-center
              text-white
              shadow-md
              hover:shadow-lg
              transition
            "
          >
            <FiSearch size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
