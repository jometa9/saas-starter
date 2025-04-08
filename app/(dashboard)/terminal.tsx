"use client";

import { useEffect, useState, useRef } from "react";

export function Terminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const logTemplatesRef = useRef<string[]>([
    "[ID] BTCUSD SELL LIMIT 1.23 LOT PRICE 97380.60000 SL 102380.94329 TP 92380.20000",
    "[ID] BTCUSD SELL LIMIT 3.01 LOT PRICE 98368.93000 SL 0.00000 TP 0.00000",
    "[ID] BTCUSD SELL LIMIT 21.01 LOT PRICE 94674.44000 SL 94674.72000 TP 94674.22000",
    "[TIME] [IP 192.168.0.102] [UPTIME] RECEIVING NEW ORDERS...",
    "[ID] BTCUSD SELL LIMIT 1.23 LOT PRICE 97380.60000 SL 102380.94329 TP 92380.20000",
    "[ID] BTCUSD SELL LIMIT 3.01 LOT PRICE 98368.93000 SL 0.00000 TP 0.00000",
    "[ID] BTCUSD SELL LIMIT 21.01 LOT PRICE 94674.44000 SL 94674.72000 TP 94674.22000",
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const currentLineIndexRef = useRef(0);
  const isTypingRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const orderIdBaseRef = useRef(1100574500);

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}${minutes}${seconds} ${ampm}`;
  };

  const getUptime = () => {
    const uptimeMs = Date.now() - startTimeRef.current;
    const uptimeSec = Math.floor(uptimeMs / 1000);
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;
    return `UPTIME ${hours}H ${minutes}M ${seconds}S`;
  };

  const generateOrderId = () => {
    return (
      orderIdBaseRef.current + Math.floor(Math.random() * 100)
    ).toString();
  };

  const customizeLog = (template: string) => {
    let customizedLog = template;

    if (customizedLog.includes("[TIME]")) {
      customizedLog = customizedLog.replace("[TIME]", `[${getCurrentTime()}]`);
    }

    if (customizedLog.includes("[UPTIME]")) {
      customizedLog = customizedLog.replace("[UPTIME]", `[${getUptime()}]`);
    }

    if (customizedLog.includes("[ID]")) {
      customizedLog = customizedLog.replace("[ID]", `[${generateOrderId()}]`);
    }

    return customizedLog;
  };

  const addLog = () => {
    if (currentLineIndexRef.current >= logTemplatesRef.current.length) {
      currentLineIndexRef.current = 0;
    }

    const template = logTemplatesRef.current[currentLineIndexRef.current];
    const nextLine = customizeLog(template);

    setLogs((prevLogs) => {
      const newLogs = [...prevLogs, nextLine];
      if (newLogs.length > 20) {
        return newLogs.slice(newLogs.length - 20);
      }
      return newLogs;
    });

    currentLineIndexRef.current++;

    if (terminalRef.current) {
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  useEffect(() => {
    const simulateNewLogs = () => {
      if (isTypingRef.current) return;
      isTypingRef.current = true;

      addLog();

      const interval = setInterval(
        () => {
          addLog();
        },
        500
      );

      return () => clearInterval(interval);
    };

    simulateNewLogs();

    return () => {
      isTypingRef.current = false;
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      <div className="relative">
        <div className="rounded-lg border border-gray-300 shadow-2xl">
          <div
            ref={terminalRef}
            className="p-4 h-80  text-xs text-gray-500 font-mono overflow-hidden"
          >
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
