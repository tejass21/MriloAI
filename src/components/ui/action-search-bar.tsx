
import * as React from "react"
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { ActionType } from "@/types/action"

interface ActionSearchBarProps {
  actions: ActionType[]
  className?: string
  onSelectAction?: (action: ActionType) => void
}

export function ActionSearchBar({ actions, className, onSelectAction }: ActionSearchBarProps) {
  return (
    <Command className={cn("rounded-lg border shadow-md", className)}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandGroup>
          {actions.map((action) => (
            <CommandItem
              key={action.id}
              className="flex items-center justify-between py-3 px-4 cursor-pointer"
              onSelect={() => {
                console.log(`Selected: ${action.label}`);
                if (onSelectAction) {
                  onSelectAction(action);
                }
              }}
            >
              <div className="flex items-center gap-2">
                {action.icon}
                <div>
                  <div className="font-medium">{action.label}</div>
                  {action.description && (
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {action.short && (
                  <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                    {action.short}
                  </kbd>
                )}
                {action.end && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {action.end}
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
