import { useState, useCallback, useEffect } from "react";

export function useClipboard(
    text: string,
    userTimeout?: number
  ) {
    // modified version of Chakra UI useClipboard.
  
    const [hasCopied, setHasCopied] = useState(false)
  
    const timeout = userTimeout ? userTimeout : 1500; 
  
    const onCopy = useCallback(() => {

      console.log(text);
      navigator.clipboard.writeText(text)
      setHasCopied(true)
    }, [text])
  
    useEffect(() => {
      let timeoutId: number | null = null
  
      if (hasCopied) {
        timeoutId = window.setTimeout(() => {
          setHasCopied(false)
        }, timeout)
      }
  
      return () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId)
        }
      }
    }, [timeout, hasCopied])
  
    return { value: text, onCopy, hasCopied }
  }
  