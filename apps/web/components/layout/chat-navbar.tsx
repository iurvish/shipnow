"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Search, Database, Network, Clock } from "lucide-react";
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
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="font-medium">{selectedOption.name}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80 rounded-none">
            <div className="p-2">
              <div className="text-sm font-medium mb-2">Search Options</div>
              {searchOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className={`flex items-start gap-3 p-3 cursor-pointer rounded-none ${
                    !option.available ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={!option.available}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <option.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{option.name}</span>
                      {!option.available && (
                        <Badge
                          variant="secondary"
                          className="text-xs rounded-none bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </Badge>
                      )}
                      {selectedOption.id === option.id && option.available && (
                        <Badge
                          variant="default"
                          className="text-xs rounded-none"
                        >
                          Selected
                        </Badge>
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
