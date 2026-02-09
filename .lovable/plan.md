

## Abrir WhatsApp Direto no App (Android)

### Problema
No Android, a URL `https://wa.me/` abre primeiro no navegador, que depois redireciona para o WhatsApp. Esse processo intermediario causa problemas na codificacao dos emojis, que chegam quebrados.

### Solucao
Criar uma funcao helper `buildWhatsAppUrl` que detecta o dispositivo e usa o esquema de URL mais adequado:

- **Android**: Usar `intent://send/PHONE#Intent;scheme=whatsapp;package=com.whatsapp;action=android.intent.action.SENDTO;S.jid=PHONE@s.whatsapp.net;S.text=MESSAGE;end;` - isso abre o WhatsApp diretamente sem passar pelo navegador.
- **iOS/Desktop**: Manter `https://wa.me/PHONE?text=MESSAGE` que ja funciona bem.

Alem disso, no Android, em vez de usar `window.open` com redirecionamento (que causa os problemas de encoding), vamos usar `window.location.href` diretamente com o intent URI, pois o intent nao abre uma pagina web - ele abre o app diretamente.

### Mudanca na logica de abertura de janela (Android)
No Android, nao precisamos mais abrir janelas em branco antecipadamente. O `intent://` abre o app diretamente via `window.location.href`. Para multiplos barbeiros no Android, usaremos apenas o primeiro (limitacao do intent) e os demais serao enviados via fallback `https://api.whatsapp.com/send`.

### Arquivo a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/Cart.tsx` | Adicionar funcao `buildWhatsAppUrl(phone, message)` e refatorar a logica de abertura do WhatsApp |

### Detalhes Tecnicos

**Nova funcao helper:**

```text
buildWhatsAppUrl(phone: string, message: string): string
  - Detecta Android via /Android/i.test(navigator.userAgent)
  - Android: retorna intent://send/${phone}#Intent;scheme=whatsapp;package=com.whatsapp;S.text=${encodeURIComponent(message)};end;
  - iOS/Desktop: retorna https://wa.me/${phone}?text=${encodeURIComponent(message)}
```

**Nova funcao helper para abrir WhatsApp:**

```text
openWhatsApp(phone: string, message: string, preOpenedWindow?: Window | null)
  - Android: window.location.href = buildWhatsAppUrl(phone, message)
  - iOS/Desktop: preOpenedWindow.location.href = buildWhatsAppUrl(phone, message)
```

**Mudancas no fluxo `handleFinish`:**
1. Pre-abertura de janelas: somente para iOS/Desktop (Android nao precisa)
2. Envio para barbeiro com servicos (~linha 302-310): usar `openWhatsApp`
3. Envio para produtos apenas (~linha 334-340): usar `openWhatsApp`
4. Funcao `formatWhatsAppMessage` (~linha 136): usar `buildWhatsAppUrl`

**Tres pontos de alteracao no codigo:**
1. Adicionar as funcoes helper `buildWhatsAppUrl` e `openWhatsApp` no componente
2. Condicionar a pre-abertura de janelas apenas para nao-Android
3. Substituir todas as atribuicoes `location.href` pelas funcoes helper

