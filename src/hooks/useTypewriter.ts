import { useEffect, useState } from 'react';

/**
 * Cycles through a list of words — types each one, pauses,
 * deletes it, moves to the next. Loops forever.
 *
 * Original behavior from LandingView:
 *  - typing speed: 110ms per character
 *  - deleting speed: 60ms per character
 *  - pause after full word: 1500ms
 */
export function useCyclingTypewriter(
  words: string[],
  typingSpeed = 110,
  deletingSpeed = 60,
  pauseMs = 1500
) {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(words[0] ?? '');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          currentWord.slice(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    if (!isDeleting && currentText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pauseMs,
  ]);

  return currentText;
}

/**
 * Types a single string once and stops. Used for the footer.
 *
 * Original behavior from LandingView:
 *  - speed: 150ms per character
 */
export function useOnceTypewriter(
  text: string,
  speed = 150
) {
  const [value, setValue] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        index++;
        setValue(text.slice(0, index));
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return value;
}