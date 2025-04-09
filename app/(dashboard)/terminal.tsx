"use client";

import { useEffect, useState, useRef } from "react";

export function Terminal() {
  const logTemplatesRef = useRef<string[]>([
    "[ID] BTCUSD SELL 1.23 LOT PRICE 97380.60 SL 99380.94 TP 92380.20",
    "[ID] BTCUSD SELL 3.01 LOT PRICE 98368.93 SL 0.00 TP 0.00",
    "[ID] BTCUSD SELL 21.01 LOT PRICE 94674.44 SL 94674.72 TP 94674.22",
    "[TIME] [IP 192.168.0.102] [UPTIME] LISTENING...",
    "[ID] BTCUSD SELL 1.23 LOT PRICE 97380.60 SL 99380.94 TP 92380.20",
    "[ID] BTCUSD SELL 3.01 LOT PRICE 98368.93 SL 0.00 TP 0.00",
    "[ID] BTCUSD SELL 21.01 LOT PRICE 94674.44 SL 94674.72 TP 94674.22",
    "[ID] BTCUSD SELL 1.23 LOT PRICE 97380.60 SL 99380.94 TP 92380.20",
    "[ID] BTCUSD SELL 3.01 LOT PRICE 98368.93 SL 0.00 TP 0.00",
    "[ID] BTCUSD SELL 21.01 LOT PRICE 94674.44 SL 94674.72 TP 94674.22",
    "[TIME] [IP 192.168.0.102] [UPTIME] LISTENING...",
    "[ID] BTCUSD SELL 1.23 LOT PRICE 97380.60 SL 99380.94 TP 92380.20",
    "[ID] BTCUSD SELL 3.01 LOT PRICE 98368.93 SL 0.00 TP 0.00",
    "[ID] BTCUSD SELL 21.01 LOT PRICE 94674.44 SL 94674.72 TP 94674.22",
    "[ID] BTCUSD SELL 1.23 LOT PRICE 97380.60 SL 99380.94 TP 92380.20",
    "[ID] BTCUSD SELL 3.01 LOT PRICE 98368.93 SL 0.00 TP 0.00",
    "[ID] BTCUSD SELL 21.01 LOT PRICE 94674.44 SL 94674.72 TP 94674.22",
    "[TIME] [IP 192.168.0.102] [UPTIME] LISTENING...",
    "[ID] BTCUSD SELL 1.23 LOT PRICE 97380.60 SL 99380.94 TP 92380.20",
    "[ID] BTCUSD SELL 3.01 LOT PRICE 98368.93 SL 0.00 TP 0.00",
    "[ID] BTCUSD SELL 21.01 LOT PRICE 94674.44 SL 94674.72 TP 94674.22",
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const currentLineIndexRef = useRef(0);
  const isTypingRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const orderIdBaseRef = useRef(1100574500);
  
  // Inicializamos con un array vacío para evitar problemas de hidratación
  const [logs, setLogs] = useState<string[]>([]);

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

  const generateInitialLogs = () => {
    const initialLogs: string[] = [];
    for (let i = 0; i < logTemplatesRef.current.length; i++) {
      initialLogs.push(customizeLog(logTemplatesRef.current[i]));
    }
    return initialLogs;
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
    // Generamos los logs iniciales SOLO en el cliente
    if (logs.length === 0) {
      setLogs(generateInitialLogs());
    }
    
    // Actualizar el scrollTop para mostrar los últimos logs
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

    const simulateNewLogs = () => {
      if (isTypingRef.current) return;
      isTypingRef.current = true;

      // Añadimos más logs después de un breve retraso
      const interval = setInterval(
        () => {
          addLog();
        },
        250
      );

      return () => clearInterval(interval);
    };

    // Pequeño retraso antes de iniciar la simulación de nuevos logs
    const timeout = setTimeout(() => {
      simulateNewLogs();
    }, 500);

    return () => {
      clearTimeout(timeout);
      isTypingRef.current = false;
    };
  }, [logs.length]);

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
