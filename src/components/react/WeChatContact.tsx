import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { WeChatIcon } from "../icons/SocialIcons";
import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";

interface WeChatContactProps {
  wechatId: string;
  qrCode?: string;
  lang?: "zh" | "en";
}

export function WeChatContact({
  wechatId,
  qrCode,
  lang = "zh",
}: WeChatContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部自动关闭浮层
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy WeChat ID:", err);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const isEn = lang === "en";

  return (
    <div className="relative inline-block" ref={containerRef}>
      <Button
        type="button"
        onClick={toggleOpen}
        aria-label={isEn ? "WeChat Profile" : "微信联系"}
        title={isEn ? `WeChat: ${wechatId}` : `微信联系: ${wechatId}`}
      >
        <WeChatIcon className="h-6 w-6" />
        <span className="sr-only">WeChat</span>
      </Button>

      {/* 弹出气泡卡片 */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={isEn ? "WeChat Contact Info" : "微信联系信息"}
          className="absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-64 p-3.5 rounded-xl border bg-card text-card-foreground shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#07C160]">
              <WeChatIcon className="h-3.5 w-3.5" />
              <span>{isEn ? "WeChat Contact" : "微信联系"}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">ID / 微信号</span>
          </div>

          {qrCode && (
            <div className="mb-2.5 flex justify-center">
              <img
                src={qrCode}
                alt="WeChat QR Code"
                className="w-32 h-32 rounded-lg object-contain border bg-white p-1"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-secondary/60 border border-border/40">
            <span className="font-mono text-xs font-bold text-foreground select-all break-all">
              {wechatId}
            </span>
            <Button
              type="button"
              size="sm"
              variant={copied ? "default" : "secondary"}
              onClick={handleCopy}
              className={`h-7 px-2 text-xs gap-1 shrink-0 ${
                copied ? "bg-[#07C160] hover:bg-[#07C160]/90 text-white" : ""
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>{isEn ? "Copied" : "已复制"}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>{isEn ? "Copy" : "复制"}</span>
                </>
              )}
            </Button>
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground text-center">
            {isEn
              ? "Click copy, search ID on WeChat to connect."
              : "点击复制微信号，搜索添加好友时请备注来意"}
          </p>

          {/* 气泡小箭头 */}
          <div className="absolute top-full left-4 sm:left-1/2 sm:-translate-x-1/2 -mt-1 border-4 border-transparent border-t-card" />
        </div>
      )}
    </div>
  );
}
