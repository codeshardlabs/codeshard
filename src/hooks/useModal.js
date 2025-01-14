import { useEffect } from "react";
export const useModal = (isModalOpen, setIsModalOpen, ref) => {
  useEffect(() => {
    const handleBodyClick = (e) => {
      if (isModalOpen && ref.current && !ref.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("click", handleBodyClick);
    return () => {
      document.removeEventListener("click", handleBodyClick);
    };
  }, [isModalOpen]);
};
