"use client";

import * as React from "react";

interface TabsContextType {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  // Use the value prop if provided (controlled), otherwise use internal state (uncontrolled)
  const currentValue = value !== undefined ? value : internalValue;

  // Create a setValue function that matches React.Dispatch<React.SetStateAction<string>>
  const setValue: React.Dispatch<React.SetStateAction<string>> =
    React.useCallback(
      (action) => {
        // Handle both direct values and updater functions
        const newValue =
          typeof action === "function" ? action(currentValue) : action;

        // Update internal state if uncontrolled
        if (value === undefined) {
          setInternalValue(newValue);
        }

        // Call onValueChange callback if provided
        if (onValueChange) {
          onValueChange(newValue);
        }
      },
      [currentValue, value, onValueChange]
    );

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`flex space-x-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  ...props
}) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const isActive = context.value === value;

  return (
    <button
      className={`${className} ${
        isActive
          ? "bg-surface-light text-white"
          : "text-gray-400 hover:text-white"
      }`}
      onClick={() => context.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
  ...props
}) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  return context.value === value ? (
    <div className={className} {...props}>
      {children}
    </div>
  ) : null;
};
