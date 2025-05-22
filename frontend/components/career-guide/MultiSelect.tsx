"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      handleUnselect(item)
    } else {
      onChange([...selected, item])
    }
  }
  
  // Get labels for selected values
  const getOptionLabel = (value: string) => {
    return options.find(option => option.value === value)?.label || value
  }

  return (
    <div className="relative">
      <div className="border border-input rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-ring min-h-10">
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => (
            <Badge key={item} variant="secondary" className="bg-muted">
              {getOptionLabel(item)}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleUnselect(item)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive
            ref={inputRef}
            className="flex-1 outline-none"
          >
            <input
              placeholder={selected.length === 0 ? placeholder : ""}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              className="border-0 p-0 outline-none placeholder:text-muted-foreground bg-transparent focus:outline-none text-sm"
            />
          </CommandPrimitive>
        </div>
      </div>
      
      <div className={`relative ${open ? '' : 'hidden'}`}>
        <Command className="absolute top-1 w-full z-10 border rounded-md shadow-md">
          <CommandGroup className="max-h-64 overflow-auto">
            {options
              .filter((option) => {
                if (!inputValue) return true
                return option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
              })
              .map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onSelect={() => {
                    handleSelect(option.value)
                    setInputValue("")
                  }}
                >
                  <div
                    className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                      selected.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50"
                    }`}
                  >
                    {selected.includes(option.value) && (
                      <div>✓</div>
                    )}
                  </div>
                  {option.label}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </div>
    </div>
  )
}