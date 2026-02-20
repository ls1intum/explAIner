"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeToast, type Toast } from "@/store/slices/toastSlice";
import { CrossCircledIcon, CheckCircledIcon, InfoCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

// Toast notification component

export default function Toast() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.toast.toasts);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast: Toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

function ToastItem({ id, message, type, onClose }: ToastItemProps) {
  const dispatch = useAppDispatch();

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, dispatch]);

  // Icon and color based on type
  const config = {
    success: {
      icon: <CheckCircledIcon className="w-5 h-5" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-800",
      iconColor: "text-green-500",
    },
    error: {
      icon: <CrossCircledIcon className="w-5 h-5" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-800",
      iconColor: "text-red-500",
    },
    info: {
      icon: <InfoCircledIcon className="w-5 h-5" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
    },
    warning: {
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500",
    },
  }[type];

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-lg shadow-lg animate-slideInRight flex items-start gap-3`}
    >
      <div className={config.iconColor}>{config.icon}</div>
      <p className={`${config.textColor} text-sm font-medium flex-1`}>{message}</p>
      <button
        onClick={onClose}
        className={`${config.iconColor} hover:opacity-70 transition-opacity`}
        aria-label="Close"
      >
        <CrossCircledIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
