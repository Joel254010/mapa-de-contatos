export type Categoria = 'Compra' | 'Venda' | 'Financiamento' | 'Consórcio' | 'Avaliação' | 'Pergunta rápida' | 'Suporte' | 'Outro';

export type Status = 'Iniciada' | 'Em andamento' | 'Aguardando resposta' | 'Concluída' | 'Perdida';

export type Origem = 'WhatsApp' | 'Instagram' | 'Site' | 'Indicação';

export interface Conversa {
  id: string;
  nome: string;
  telefone: string;
  categoria: Categoria;
  estado: string;
  origem: Origem;
  descricao: string;
  data: string;
  status: Status;
  created_at: string;
  updated_at: string;
}

export const CATEGORIAS: Categoria[] = [
  'Compra',
  'Venda',
  'Financiamento',
  'Consórcio',
  'Avaliação',
  'Pergunta rápida',
  'Suporte',
  'Outro'
];

export const STATUS_OPTIONS: Status[] = [
  'Iniciada',
  'Em andamento',
  'Aguardando resposta',
  'Concluída',
  'Perdida'
];

export const ORIGENS: Origem[] = [
  'WhatsApp',
  'Instagram',
  'Site',
  'Indicação'
];

export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const ESTADO_NAMES: Record<string, string> = {
  'AC': 'Acre',
  'AL': 'Alagoas',
  'AP': 'Amapá',
  'AM': 'Amazonas',
  'BA': 'Bahia',
  'CE': 'Ceará',
  'DF': 'Distrito Federal',
  'ES': 'Espírito Santo',
  'GO': 'Goiás',
  'MA': 'Maranhão',
  'MT': 'Mato Grosso',
  'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais',
  'PA': 'Pará',
  'PB': 'Paraíba',
  'PR': 'Paraná',
  'PE': 'Pernambuco',
  'PI': 'Piauí',
  'RJ': 'Rio de Janeiro',
  'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia',
  'RR': 'Roraima',
  'SC': 'Santa Catarina',
  'SP': 'São Paulo',
  'SE': 'Sergipe',
  'TO': 'Tocantins'
};
