"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Database, Network, Clock, Check } from "lucide-react";
import { useState } from "react";

interface SearchOption {
  id: string;
  name: string;
  description: string;
  available: boolean;
  icon: any;
}

const searchOptions: SearchOption[] = [
  {
    id: "app-data",
    name: "Search in app data",
    description: "Search through your application data",
    available: true,
    icon: Database,
  },
  {
    id: "network",
    name: "Search your network",
    description: "Search across your connected networks",
    available: false,
    icon: Network,
  },
];

export function ChatNavbar() {
  const [selectedOption, setSelectedOption] = useState<SearchOption>(
    searchOptions[0]!
  );

  const handleOptionSelect = (option: SearchOption) => {
    if (option.available) {
      setSelectedOption(option);
    }
  };

  return (
    <div className="flex h-14 items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 gap-2 rounded-none">
              <span className="font-medium">{selectedOption.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80 rounded-none">
            <div className="p-2">
              <div className="text-sm font-medium mb-3 text-foreground">
                Search Options
              </div>
              {searchOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className={`flex items-start gap-3 p-3 cursor-pointer rounded-none ${
                    !option.available ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={!option.available}
                >
                  <option.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{option.name}</span>
                      {!option.available && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0.5 rounded-none bg-muted text-muted-foreground border-0"
                        >
                          Coming Soon
                        </Badge>
                      )}
                      {selectedOption.id === option.id && option.available && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:inline-flex rounded-none"
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
}
