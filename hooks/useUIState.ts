"use client";

import { useState } from "react";

/**
 * UI STATE ONLY
 * - modal
 * - accordion
 * - loading
 * - index fokus
 *
 * ❗ Tidak ada logic bisnis di sini
 */

export const useUIState = () => {
  /* ================= LOADING ================= */

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingCheckout, setLoadingCheckout] = useState<boolean>(false);

  /* ================= ACCORDION ================= */

  const [expandedOrderIndex, setExpandedOrderIndex] = useState<number | null>(
    null,
  );

  const toggleAccordion = (index: number) => {
    setExpandedOrderIndex((prev) => (prev === index ? null : index));
  };

  /* ================= CURRENT ORDER (UI FOCUS) ================= */

  const [currentOrder, setCurrentOrder] = useState<number>(0);

  /* ================= RETURN ================= */

  return {
    /* loading */
    isLoading,
    setIsLoading,

    loadingCheckout,
    setLoadingCheckout,

    /* accordion */
    expandedOrderIndex,
    toggleAccordion,

    /* current order */
    currentOrder,
    setCurrentOrder,
  };
};
