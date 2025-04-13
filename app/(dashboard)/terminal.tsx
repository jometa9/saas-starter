"use client";

import { useEffect, useState, useRef } from "react";

export function Terminal() {
  const logTemplatesRef = useRef<string[]>([
    "[ID]",
    "[ID]",
    "[ID]",
    "[TIME] [IP 192.168.0.104] [UPTIME] LISTENING...",
    "[ID]",
    "[ID]",
    "[ID]",
    "[ID]",
    "[ID]",
    "[ID]",
    "[TIME] [IP 192.168.0.104] [UPTIME] LISTENING...",
    "[ID]",
    "[ID]",
    "[ID]",
    "[ID]",
    "[ID]",
    "[ID]",
    "[TIME] [IP 192.168.0.104] [UPTIME] LISTENING...",
    "[ID]",
    "[ID]",
    "[ID]",
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);
  const currentLineIndexRef = useRef(0);
  const isTypingRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const orderIdBaseRef = useRef(1100574500);

  const forexPairs = [
    "EURUSD",
    "GBPUSD",
    "USDJPY",
    "AUDUSD",
    "USDCAD",
    "NZDUSD",
    "EURGBP",
    "EURJPY",
    "GBPJPY",
    "AUDNZD",
  ];

  const getRandomForexPair = () => {
    return forexPairs[Math.floor(Math.random() * forexPairs.length)];
  };

  const getRandomLot = () => {
    return (Math.random() * 5).toFixed(2);
  };

  const getRandomPrice = () => {
    return (Math.random() * 100000).toFixed(2);
  };

  const getRandomTPandSL = (price: string) => {
    const priceNum = parseFloat(price);
    const tp = (priceNum + Math.random() * 1000).toFixed(2);
    const sl = (priceNum - Math.random() * 1000).toFixed(2);
    return { tp, sl };
  };

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
    const hours = Math.floor(uptimeSec / 3700);
    const minutes = Math.floor((uptimeSec % 3700) / 60);
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
      const forexPair = getRandomForexPair();
      const lot = getRandomLot();
      const price = getRandomPrice();
      const { tp, sl } = getRandomTPandSL(price);
      const orderId = generateOrderId();

      const orderTypes = [
        "BUY",
        "SELL",
        "BUY LIMIT",
        "SELL LIMIT",
        "BUY STOP",
        "SELL STOP",
      ];
      const orderType =
        orderTypes[Math.floor(Math.random() * orderTypes.length)];

      customizedLog = customizedLog.replace(
        "[ID]",
        `[${orderId}] ${forexPair} ${orderType} ${lot} LOT PRICE ${price} SL ${sl} TP ${tp}`
      );
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

  const simulateNewLogs = () => {
    if (isTypingRef.current) return;
    isTypingRef.current = true;

    const addLogWithRandomInterval = () => {
      addLog();
      const randomInterval = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
      setTimeout(addLogWithRandomInterval, randomInterval);
    };

    addLogWithRandomInterval();
  };

  useEffect(() => {
    if (logs.length === 0) {
      setLogs(generateInitialLogs());
    }

    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

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
            className="p-3 pb-2 h-80 text-[10px] text-gray-700 font-mono overflow-hidden"
          >
            {logs.map((log, index) => {
              const orderTypeMatch = log.match(/BUY|SELL|BUY LIMIT|SELL LIMIT|BUY STOP|SELL STOP/);
              const orderType = orderTypeMatch ? orderTypeMatch[0] : '';
              
              const forexPairMatch = log.match(/[A-Z]{6}/);
              const forexPair = forexPairMatch ? forexPairMatch[0] : '';

              const ipMatch = log.match(/\[IP 192\.168\.0\.\d+\]/);
              const ipAddress = ipMatch ? ipMatch[0] : '';

              const uptimeMatch = log.match(/\[UPTIME \d+H \d+M \d+S\]/);
              const uptime = uptimeMatch ? uptimeMatch[0] : '';

              return (
                <div key={index}>
                  {log.split(' ').map((word, wordIndex) => {
                    if (word === forexPair) {
                      return <span key={wordIndex} className="text-black">{word} </span>;
                    }
                    if (ipAddress.includes(word)) {
                      return <span key={wordIndex} className="text-red-700">{word} </span>;
                    }
                    if (word === 'LISTENING...') {
                      return <span key={wordIndex} className="text-green-700">{word} </span>;
                    }
                    if (word === 'UPTIME' || uptime.includes(word)) {
                      return <span key={wordIndex} className="text-blue-700">{word} </span>;
                    }
                    if (word === 'BUY' || word === 'SELL') {
                      let orderColor = 'text-gray-700';
                      if (orderType.includes('LIMIT') || orderType.includes('STOP')) {
                        orderColor = 'text-blue-700';
                      } else if (word === 'BUY') {
                        orderColor = 'text-green-700';
                      } else if (word === 'SELL') {
                        orderColor = 'text-red-700';
                      }
                      return <span key={wordIndex} className={`${orderColor}`}>{word} </span>;
                    }
                    if (word === 'LIMIT' || word === 'STOP') {
                      return <span key={wordIndex} className="text-blue-700">{word} </span>;
                    }
                    return <span key={wordIndex}>{word} </span>;
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
