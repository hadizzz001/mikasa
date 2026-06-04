"use client";

interface Props {
  qty: number;
  max?: number;
  onChange: (qty: number) => void;
}

// Simple quantity stepper. `max` is computed from the product data on the page
// (no extra fetch needed) and caps the value.
export default function QuantitySelector({ qty, max = Infinity, onChange }: Props) {
  const dec = () => {
    if (qty > 1) onChange(qty - 1);
  };
  const inc = () => {
    if (qty < max) onChange(qty + 1);
  };

  return (
    <div className="inline-flex items-center border border-[var(--border)] rounded-md">
      <button
        type="button"
        onClick={dec}
        disabled={qty <= 1}
        className="w-10 h-10 flex items-center justify-center text-lg font-semibold disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 text-center font-semibold select-none">{qty}</span>
      <button
        type="button"
        onClick={inc}
        disabled={qty >= max}
        className="w-10 h-10 flex items-center justify-center text-lg font-semibold disabled:opacity-40"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
