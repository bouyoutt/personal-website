import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * X (Twitter) 矢量徽标
 */
export function XIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * Telegram 矢量纸飞机徽标
 */
export function TelegramIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

/**
 * 微信 (WeChat) 矢量徽标
 */
export function WeChatIcon({ className = "h-6 w-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      {...props}
    >
      <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.99.98 3.78 2.54 5.01L2.7 16.5l3.41-.95c.76.22 1.56.34 2.39.34.2 0 .4 0 .6-.02C9.04 15.34 9 14.8 9 14.25 9 10.25 12.8 7 17.5 7c.4 0 .79.03 1.17.08C17.65 4.14 13.45 2 8.5 2zm-2.25 4.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm4.5 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM17.5 8.5c-4.14 0-7.5 2.8-7.5 6.25 0 1.95 1.07 3.68 2.73 4.79L12 22l2.84-.79c.84.22 1.73.34 2.66.34 4.14 0 7.5-2.8 7.5-6.25S21.64 8.5 17.5 8.5zm-2 4.5a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  );
}
