"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeToast, type Toast } from "@/store/slices/uiSlice";
import { CrossCircledIcon, CheckCircledIcon, InfoCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

/** Toast component - displays pop-up notifications */
export default function Toast() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

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

  // Icon and colors from theme
  const config = {
    success: {
      icon: <CheckCircledIcon className="w-5 h-5" />,
      bgColor: "bg-success/10",
      borderColor: "border-success",
      textColor: "text-success",
      iconColor: "text-success",
    },
    error: {
      icon: <CrossCircledIcon className="w-5 h-5" />,
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive",
      textColor: "text-destructive",
      iconColor: "text-destructive",
    },
    info: {
      icon: <InfoCircledIcon className="w-5 h-5" />,
      bgColor: "bg-primary/10",
      borderColor: "border-primary",
      textColor: "text-primary",
      iconColor: "text-primary",
    },
    warning: {
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      bgColor: "bg-warning/10",
      borderColor: "border-warning",
      textColor: "text-warning",
      iconColor: "text-warning",
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
