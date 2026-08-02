import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { COUNTRIES, Country } from '../utils/countries';

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CountryCodeSelector({ value, onChange }: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find currently selected country
  const selectedCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.code === value) || COUNTRIES.find((c) => c.code === '+234') || COUNTRIES[0];
  }, [value]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Search filter and sort logic
  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return COUNTRIES;

    // Check if query is numeric (representing phone code)
    const isNumeric = /^[0-9]+$/.test(query);

    if (isNumeric) {
      // For numeric search, ignore '+' in code and match
      return COUNTRIES.filter((c) => {
        const cleanCode = c.code.replace('+', '').replace('-', '');
        return cleanCode.includes(query);
      });
    }

    // Text search: sort so starts-with matches come first, then contains matches
    const startsWithMatches: Country[] = [];
    const containsMatches: Country[] = [];

    for (const country of COUNTRIES) {
      const nameLower = country.name.toLowerCase();
      if (nameLower.startsWith(query)) {
        startsWithMatches.push(country);
      } else if (nameLower.includes(query)) {
        containsMatches.push(country);
      }
    }

    return [...startsWithMatches, ...containsMatches];
  }, [searchQuery]);

  return (
    <div className="relative inline-block w-full" ref={containerRef} id="country-selector-wrapper">
      {/* Trigger Button */}
      <button
        id="country-selector-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-zinc-200 bg-zinc-50 text-zinc-900 focus:bg-white hover:border-zinc-400 focus:outline-none focus:border-zinc-800 transition-colors cursor-pointer text-xs font-mono font-bold"
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-base leading-none shrink-0">{selectedCountry.flag}</span>
          <span className="truncate">{selectedCountry.name}</span>
          <span className="text-zinc-500 shrink-0">{selectedCountry.code}</span>
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0 ml-1" />
      </button>

      {/* Floating Dropdown Container */}
      {isOpen && (
        <div
          id="country-selector-dropdown"
          className="absolute left-0 right-0 z-50 mt-1 bg-white border border-zinc-200 shadow-lg flex flex-col animate-fade-in"
          style={{ width: '100%' }}
        >
          {/* Search Box */}
          <div className="p-2 border-b border-zinc-100 flex items-center gap-1.5 bg-zinc-50">
            <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country or dial code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs text-zinc-800 focus:outline-none font-sans"
            />
          </div>

          {/* List - max 5 visible rows, custom scrollable height */}
          <div
            id="country-selector-options"
            className="overflow-y-auto divide-y divide-zinc-50 max-h-[170px]" // 34px * 5 = 170px for exactly 5 visible rows max
          >
            {filteredCountries.length === 0 ? (
              <div className="p-3 text-center text-zinc-400 font-sans text-[11px]">
                No countries found
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = country.code === value;
                return (
                  <button
                    key={country.name + country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-zinc-100 cursor-pointer ${
                      isSelected ? 'bg-zinc-50 font-bold' : ''
                    }`}
                    style={{ height: '34px' }}
                  >
                    <span className="flex items-center gap-2 truncate font-sans text-zinc-800">
                      <span className="text-sm shrink-0 leading-none">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-zinc-500 text-[10px] shrink-0">
                      <span>{country.code}</span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-600 ml-1 shrink-0" />}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
