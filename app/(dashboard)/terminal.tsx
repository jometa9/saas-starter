'use client';

import { useEffect, useState } from 'react';
import { Terminal as LucideTerminal } from 'lucide-react';

export function Terminal() {
  const [text, setText] = useState('');
  const [fullText, setFullText] = useState(
    `> Starting IPTRADE v1.0.0
> Scanning for MetaTrader terminals...
> Found: MT4 Terminal (account: 12345678)
> Found: MT5 Terminal (account: 87654321)
> Configuring MT4 as MASTER account
> Configuring MT5 as SLAVE account
> Connection established successfully
> Monitoring for trades...
> MASTER: New order detected (Buy 0.10 EURUSD @ 1.08742)
> SLAVE: Copying order...
> SLAVE: Order copied successfully (Buy 0.10 EURUSD @ 1.08742)
> Trade copied in 7ms - Same IP address confirmed`
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(text + fullText[index]);
        setIndex(index + 1);
      }, 25);
      return () => clearTimeout(timeout);
    }
  }, [fullText, index, text]);

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      <div className="relative">
        <div className="absolute top-2 left-2 flex h-auto rounded-full p-1 gap-1 z-10 bg-gray-800/90">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-xl">
          <div className="p-4 h-80 overflow-auto bg-gray-900 font-mono text-xs text-gray-100">
            <pre>{text}</pre>
            <div className="inline-block h-4 w-1.5 -mb-0.5 bg-gray-100 animate-pulse"></div>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 z-10 bg-gray-800 bg-opacity-75 rounded-full p-2">
          <LucideTerminal className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
