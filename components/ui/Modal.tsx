const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-30"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-40">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3>{title}</h3>
            <button onClick={onClose} className="outlined">
              Close
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
