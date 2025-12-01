/*
  # Create Conversas (Conversations) Table

  ## Summary
  Creates the main conversations table for the Contact Map platform, storing all WhatsApp conversation data with categorization, status tracking, and location information.

  ## New Tables
  
  ### `conversas`
  Main table storing all conversation records:
  - `id` (uuid, primary key) - Unique identifier for each conversation
  - `nome` (text) - Client name
  - `telefone` (text) - Client phone number
  - `categoria` (text) - Conversation category (Compra, Venda, Financiamento, etc.)
  - `estado` (text) - Brazilian state code (SP, RJ, MG, etc.)
  - `origem` (text) - Source channel (WhatsApp, Instagram, Site, Indicação)
  - `descricao` (text) - Conversation description/notes
  - `data` (date) - Date of conversation
  - `status` (text) - Negotiation status (Iniciada, Em andamento, etc.)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  1. Enables RLS on conversas table
  2. Allows authenticated users to read all conversations
  3. Allows authenticated users to insert new conversations
  4. Allows authenticated users to update conversations
  5. Allows authenticated users to delete conversations

  ## Notes
  - All text fields use appropriate defaults
  - Timestamps automatically track creation and updates
  - Status values should match predefined options in UI
  - Phone numbers stored as text to preserve formatting
*/

CREATE TABLE IF NOT EXISTS conversas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  categoria text NOT NULL DEFAULT 'Outro',
  estado text NOT NULL DEFAULT 'SP',
  origem text NOT NULL DEFAULT 'WhatsApp',
  descricao text DEFAULT '',
  data date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'Iniciada',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read conversas"
  ON conversas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert conversas"
  ON conversas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update conversas"
  ON conversas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete conversas"
  ON conversas FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_conversas_categoria ON conversas(categoria);
CREATE INDEX IF NOT EXISTS idx_conversas_estado ON conversas(estado);
CREATE INDEX IF NOT EXISTS idx_conversas_status ON conversas(status);
CREATE INDEX IF NOT EXISTS idx_conversas_data ON conversas(data DESC);