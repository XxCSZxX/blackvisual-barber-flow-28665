

## Corrigir Emojis Quebrados no WhatsApp (Android)

### Problema

No Android, os emojis na mensagem do WhatsApp aparecem como `�` em vez dos emojis reais (💈, 📌, 💰, etc.).

### Causa

O problema ocorre porque o `window.open` com redirecionamento via `location.href` em alguns navegadores Android não processa corretamente a URL com emojis codificados pelo `encodeURIComponent`. Embora `encodeURIComponent` suporte UTF-8, alguns WebViews Android têm problemas com caracteres multi-byte na URL.

### Solucao

Substituir os emojis Unicode por equivalentes em texto simples na mensagem do WhatsApp. Isso garante compatibilidade universal em todos os dispositivos (Android, iOS, Desktop) sem depender de codificação de emojis na URL.

### Mensagem Atual vs. Nova

| Atual | Nova |
|-------|------|
| `Olá Laurin! 💈` | `Ola Laurin!` |
| `📌 TESTE` | `- Servico: TESTE` |
| `💰 R$ 85.00` | `- Valor: R$ 85.00` |
| `📅 09/02/2026` | `- Data: 09/02/2026` |
| `👤 Nome` | `- Cliente: Nome` |
| `💳 Pagamento: PIX` | `- Pagamento: PIX` |
| `💵 Total: R$ 85.00` | `*Total: R$ 85.00*` |

**Alternativa (preferida):** Manter os emojis mas usar a API do WhatsApp com `intent://` no Android em vez de `https://wa.me/`. No entanto, a solução mais simples e confiável é remover os emojis e usar formatação de texto com asteriscos (*negrito*) que o WhatsApp suporta nativamente.

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/Cart.tsx` | Substituir emojis por texto simples em todas as mensagens do WhatsApp (linhas ~257, 260, 273, 288-298, e secao de produtos ~316-340) |

### Detalhes Tecnicos

Todas as ocorrencias de emojis nas template strings de mensagem serao substituidas:
- `💈` -> removido
- `📌` -> `*Servico:*`
- `💰` -> `*Valor:*`
- `📅` -> `*Data:*`
- `👤` -> `*Cliente:*`
- `💳` -> `*Pagamento:*`
- `💵` -> `*Total:*`
- `🎟️` -> `*Cupom*`
- `🛍️` -> `*Produtos:*`

Os asteriscos fazem o texto aparecer em **negrito** no WhatsApp, mantendo a mensagem organizada e legivel.

