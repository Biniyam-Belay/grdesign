import { useEffect, useLayoutEffect } from "react";

// Use layoutEffect only on the client to avoid SSR warnings
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
