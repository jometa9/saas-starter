-- Create trading_accounts table
CREATE TABLE IF NOT EXISTS trading_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  account_number VARCHAR(50) NOT NULL,
  platform VARCHAR(20) NOT NULL,
  server VARCHAR(100) NOT NULL,
  password TEXT NOT NULL,
  account_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  lot_coefficient NUMERIC DEFAULT 1,
  force_lot NUMERIC DEFAULT 0,
  reverse_trade BOOLEAN DEFAULT FALSE,
  connected_to_master VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_trading_accounts_user_id ON trading_accounts(user_id);
CREATE INDEX idx_trading_accounts_account_number ON trading_accounts(account_number);
CREATE INDEX idx_trading_accounts_connected_to_master ON trading_accounts(connected_to_master);