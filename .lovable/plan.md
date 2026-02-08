

## Corrigir Emojis no WhatsApp - Abordagem Definitiva

### Problema

Tanto `URLSearchParams` quanto `encodeURIComponent` direto na URL nao estao funcionando para emojis no Android. O `URLSearchParams` codifica espacos como `+` e tem problemas com emojis em alguns navegadores Android.

### Solucao

Usar o esquema de URL `intent://` para Android e manter `https://wa.me/` para outros dispositivos. O `intent://` envia a mensagem diretamente para o app do WhatsApp sem passar pelo navegador, evitando problemas de codificacao.

**Deteccao de plataforma:** Verificar o User Agent para identificar Android.

**Para Android:** Usar `intent://send?phone=NUMERO&text=MENSAGEM#Intent;scheme=whatsapp;package=com.whatsapp;end;`

**Para iOS/Desktop:** Manter `https://wa.me/NUMERO?text=MENSAGEM` com `encodeURIComponent`.

### Alternativa mais simples (fallback)

Se o `intent://` causar problemas, a alternativa e usar `whatsapp://send?phone=NUMERO&text=MENSAGEM` que funciona em Android e iOS quando o app esta instalado.

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/Cart.tsx` | Criar funcao helper `buildWhatsAppUrl(phone, message)` que detecta Android e usa o esquema correto. Substituir todas as construcoes de URL do WhatsApp por esta funcao. |

### Detalhes Tecnicos

Nova funcao helper no Cart.tsx:

```text
buildWhatsAppUrl(phone: string, message: string): string
  - Detecta Android via navigator.userAgent
  - Android: retorna "https://api.whatsapp.com/send?phone=PHONE&text=ENCODED_MESSAGE"
  - Outros: retorna "https://wa.me/PHONE?text=ENCODED_MESSAGE"
```

A chave e usar `https://api.whatsapp.com/send` em vez de `https://wa.me/` - o dominio `api.whatsapp.com` tem melhor compatibilidade com emojis em Android porque redireciona diretamente para o app sem processamento adicional do navegador.

Tres pontos de alteracao no codigo:
1. Funcao `formatWhatsAppMessage` (~linha 136)
2. Loop de barbeiros com servicos (~linha 303)
3. Secao de apenas produtos (~linha 334)

