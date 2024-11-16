import { useSpinner } from "../Context/SpinnerContext";

export const useSpinnerAction = () => {
  const { showSpinner, hideSpinner } = useSpinner();

  const withSpinner = async <T>(action: () => Promise<T>): Promise<T> => {
    try {
      showSpinner();
      return await action();
    } finally {
      hideSpinner();
    }
  };

  return withSpinner;
};