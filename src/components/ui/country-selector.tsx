
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Popular country codes with flags
export const countryCodes = [
  { value: "+1", label: "🇺🇸 United States (+1)" },
  { value: "+44", label: "🇬🇧 United Kingdom (+44)" },
  { value: "+91", label: "🇮🇳 India (+91)" },
  { value: "+61", label: "🇦🇺 Australia (+61)" },
  { value: "+86", label: "🇨🇳 China (+86)" },
  { value: "+33", label: "🇫🇷 France (+33)" },
  { value: "+49", label: "🇩🇪 Germany (+49)" },
  { value: "+81", label: "🇯🇵 Japan (+81)" },
  { value: "+7", label: "🇷🇺 Russia (+7)" },
  { value: "+55", label: "🇧🇷 Brazil (+55)" },
  { value: "+234", label: "🇳🇬 Nigeria (+234)" },
  { value: "+27", label: "🇿🇦 South Africa (+27)" },
  { value: "+971", label: "🇦🇪 UAE (+971)" },
  { value: "+966", label: "🇸🇦 Saudi Arabia (+966)" },
  { value: "+65", label: "🇸🇬 Singapore (+65)" },
];

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false);

  // Ensure value has a default to prevent undefined issues
  const selectedValue = value || "+1";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between"
        >
          {selectedValue
            ? countryCodes.find((code) => code.value === selectedValue)?.value || selectedValue
            : "+1"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country code..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {countryCodes && countryCodes.map((code) => (
              <CommandItem
                key={code.value}
                value={code.value}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValue === code.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {code.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
