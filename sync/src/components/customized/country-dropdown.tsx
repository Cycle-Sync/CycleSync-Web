"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface Country {
  alpha3: string;
  name: string;
  emoji: string;
}

const countries: Country[] = [
  { alpha3: "USA", name: "United States", emoji: "🇺🇸" },
  { alpha3: "CAN", name: "Canada", emoji: "🇨🇦" },
  { alpha3: "GBR", name: "United Kingdom", emoji: "🇬🇧" },
  { alpha3: "ZAF", name: "South Africa", emoji: "🇿🇦" },
  // Add more countries or import from a library like `i18n-iso-countries`
];

interface CountryDropdownProps {
  placeholder?: string;
  defaultValue?: string;
  onChange?: (country: Country) => void;
}

export function CountryDropdown({ placeholder, defaultValue, onChange }: CountryDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");

  React.useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const selectedCountry = countries.find((country) => country.alpha3 === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCountry ? (
            <span>
              {selectedCountry.emoji} {selectedCountry.name}
            </span>
          ) : (
            placeholder || "Select country..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.alpha3}
                  value={country.alpha3}
                  onSelect={() => {
                    setValue(country.alpha3);
                    onChange?.(country);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.alpha3 ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {country.emoji} {country.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}