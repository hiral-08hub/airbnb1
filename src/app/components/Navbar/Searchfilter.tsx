const Search=()=>{
    return(
        <>
        <div className="h-[64px] flex-row items-center justify-between  bg-gary-600 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-xl rounded-full">
            <div>
                <div className="flex flex-row items-center justify-between">
                    <div className="cursor-pointer w-[250px] h-[62px] px-8 flex flex-col rounded-full 
                     hover:bg-gray-400
                     transition-color duretion-200
                     justify-center">
                        <p className="text-xs font-semibole"> Where</p>
                         <p className="text-xm">Wanted Location</p>
                    </div>
                    <div className=" cursor-pointer  w-[150px] h-[62px] px-8 flex flex-col rounded-full 
                     hover:bg-gray-400
                     transition-color duretion-200
                     justify-center">
                        <p className="text-xs font-semibole">Check In</p>
                         <p className="text-xm">Add Date</p>
                    </div>
                    <div className="cursor-pointer  w-[150px] h-[62px] px-8 flex flex-col rounded-full 
                     hover:bg-gray-400
                     transition-color duretion-200
                     justify-center">
                        <p className="text-xs font-semibole">Check Out</p>
                         <p className="text-xm">Add Date</p>
                    </div>
                     <div className="cursor-pointer w-[150px] h-[62px] px-8 flex flex-col rounded-full 
                     hover:bg-gray-400
                     transition-color duretion-200
                     justify-center">
                        <p className="text-xs font-semibole">Who?</p>
                         <p className="text-xm">Add guests</p>
                    </div>
                     <div className="cursor-pointer h-[62px] px-8 flex flex-col rounded-full 
                     bg-red-600
                     hover:bg-red-400
                     transition-color duretion-200
                     justify-center">
                        <p className="text-xs font-semibole">S</p>
                    </div>
                    
                </div>
            </div>
          
        </div>
        </>
    )
};
export default Search;
