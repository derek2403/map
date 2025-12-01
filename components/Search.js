const Search = ({ onSearch }) => {
    return (
        <div className="p-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-white/30 rounded-xl leading-5 bg-white/40 backdrop-blur-md text-gray-800 placeholder-gray-600 focus:outline-none focus:bg-white/60 focus:ring-1 focus:ring-[#F8BC06] focus:border-[#F8BC06] sm:text-sm transition duration-150 ease-in-out shadow-sm"
                    placeholder="Search locations..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};

export default Search;
