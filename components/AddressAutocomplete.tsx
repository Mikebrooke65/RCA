'use client';

import { useState, useEffect } from 'react';

import { searchAddresses } from '@/lib/address';

interface AddressResult {
  full_address: string;
  place_id: string;
}

export default function AddressAutocomplete({ 
  value, 
  onChange, 
  onSelect 
}: { 
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: AddressResult) => void;
}) {
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchAddresses(value);
        setSuggestions(results);
      } catch (error) {
        console.error('Address search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your Riverhead address..."
        className="w-full p-2 border rounded"
        autoComplete="off"
      />
      
      {loading && (
        <div className="absolute right-3 top-3 text-gray-400">
          Searching...
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((addr, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(addr.full_address);
                onSelect(addr);
                setSuggestions([]);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            >
              <div className="font-medium">{addr.full_address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
