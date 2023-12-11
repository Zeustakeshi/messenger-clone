import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const Search = () => {
    const [searchValue, setSearchValue] = useState("");

    const debounceValue = useDebounce(searchValue);

    useEffect(() => {
        if (!debounceValue.trim()) return;
        (async () => {
            await handleSearch(debounceValue);
        })();
    }, [debounceValue]);

    const handleSearch = async (value) => {};

    return (
        <div className="w-full p-3">
            <h4 className="text-sm text-slate-600">tìm kiếm</h4>

            <div className="w-full my-2">
                <input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    type="text"
                    placeholder="tìm kiếm "
                    className="w-full px-5 py-3 rounded-md outline-blue-500 border border-slate-200"
                />
            </div>
        </div>
    );
};

export default Search;
