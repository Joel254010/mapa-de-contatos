// Supabase desativado temporariamente para evitar erros no Netlify.
// Tudo que usar "supabase" no app deve ser adaptado para localStorage enquanto isso.

export const supabase = {
  from() {
    return {
      select() {
        return Promise.resolve({ data: [] });
      },
      insert() {
        return Promise.resolve({ data: [], error: null });
      },
      update() {
        return Promise.resolve({ data: [], error: null });
      },
      delete() {
        return Promise.resolve({ data: [], error: null });
      },
      or() {
        return Promise.resolve({ data: [], error: null });
      },
      order() {
        return Promise.resolve({ data: [], error: null });
      },
    };
  }
};

