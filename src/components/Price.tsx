
"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { Loader2 } from "lucide-react";

interface PriceProps {
  amount: number;
  baseCurrency?: string;
  className?: string;
}

export function Price({ amount, baseCurrency = "USD", className = "" }: PriceProps) {
  const { currency, rates, isLoading } = useCurrency();

  if (isLoading) {
    return <span className={`inline-block animate-pulse bg-muted h-4 w-12 rounded ${className}`} />;
  }

  // Calculate converted amount
  // Formula: (Amount / BaseRate) * TargetRate
  // Since our rates are usually based on USD (BaseRate = 1), it's mostly Amount * TargetRate
  const baseRate = rates[baseCurrency] || 1;
  const targetRate = rates[currency] || 1;
  
  const convertedAmount = (amount / baseRate) * targetRate;

  // Format the currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <span className={className}>
      {formatter.format(convertedAmount)}
    </span>
  );
}
