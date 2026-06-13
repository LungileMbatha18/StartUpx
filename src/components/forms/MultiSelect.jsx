import React from "react";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";

export default function MultiSelect({ options, selected = [], onChange, placeholder = "Select options" }) {
  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selected.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="px-2.5 py-1 text-xs font-medium cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => toggle(item)}
            >
              {item}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                isSelected
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                isSelected ? "bg-primary border-primary" : "border-border"
              }`}>
                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <span className="truncate">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}