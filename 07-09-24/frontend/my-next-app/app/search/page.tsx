'use client'; 

import React, { ChangeEvent, useState } from 'react';

const Search = () => {
  const [value, setValue] = useState('Enter search...');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setValue(target.value);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      try {
        const response = await fetch(`http://localhost:3001/search/get-all-users?first_name=${value}`);
        
        if (!response.ok) {
          throw new Error('User not found');
        }

        const result = await response.json();
        setSearchResult(result.user); 
        setError(null); 

      } catch (err) {
        setError((err as Error).message); // Set the error message
        setSearchResult(null); // Clear previous search result
      }
    }
  };

  return (
    <div className="relative w-full text-gray-600">
      <input
        type="search"
        name="search"
        placeholder={value}
        className="bg-white h-10 px-5 pr-10 w-full rounded-full text-sm focus:outline-none"
        onChange={searchHandler}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M13.53 14.47a8 8 0 111.414-1.414l3.96 3.96a1 1 0 01-1.414 1.414l-3.96-3.96zM8 14a6 6 0 100-12 6 6 0 000 12z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {/* Display search result or error */}
      {searchResult && (
        <div className="mt-4">
          <p><strong>Search Result:</strong> {searchResult.first_name}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
    </div>
  );
};

export default Search;
