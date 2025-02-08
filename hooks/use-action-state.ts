"use client";

import { useState } from "react";

interface ActionState<T> {
  data?: T;
  error?: string;
  isLoading: boolean;
}

export function useActionState<T>() {
  const [state, setState] = useState<ActionState<T>>({
    isLoading: false,
  });

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const setData = (data: T) => {
    setState({ data, isLoading: false });
  };

  const setError = (error: string) => {
    setState({ error, isLoading: false });
  };

  const reset = () => {
    setState({ isLoading: false });
  };

  return {
    ...state,
    setLoading,
    setData,
    setError,
    reset,
  };
}
