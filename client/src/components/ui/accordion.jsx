import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export const Accordion = ({ children, type = "single", collapsible = false, ...props }) => {
  const [openItems, setOpenItems] = useState(new Set())

  const toggleItem = (value) => {
    if (type === "single") {
      setOpenItems(prev => {
        const newSet = new Set()
        if (!prev.has(value)) {
          newSet.add(value)
        }
        return newSet
      })
    } else {
      setOpenItems(prev => {
        const newSet = new Set(prev)
        if (newSet.has(value)) {
          newSet.delete(value)
        } else {
          newSet.add(value)
        }
        return newSet
      })
    }
  }

  return (
    <div {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { openItems, toggleItem })
      )}
    </div>
  )
}

export const AccordionItem = ({ children, value, className = "", openItems, toggleItem }) => {
  const isOpen = openItems?.has(value)

  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, isOpen, toggleItem })
      )}
    </div>
  )
}

export const AccordionTrigger = ({ children, className = "", value, isOpen, toggleItem }) => {
  return (
    <button
      className={`w-full text-left ${className}`}
      onClick={() => toggleItem(value)}
    >
      <div className="flex items-center justify-between w-full">
        {children}
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
    </button>
  )
}

export const AccordionContent = ({ children, className = "", isOpen }) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className={className}>
        {children}
      </div>
    </div>
  )
}