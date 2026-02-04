

## Plano: Corrigir WhatsApp não abrindo no iPhone

### Problema Identificado

O Safari no iOS tem uma política rigorosa chamada "transient activation" que só permite `window.open()` se for chamado **imediatamente** após uma ação do usuário (clique). No código atual:

1. Usuário clica em "Finalizar no WhatsApp"
2. Sistema verifica disponibilidade no banco de dados (operação assíncrona)
3. Sistema cria reservas no banco de dados (operação assíncrona)
4. **Depois** disso, tenta abrir `window.open()` - **BLOQUEADO no iOS**

O Safari considera que o clique já "expirou" quando o `window.open()` é executado após as operações assíncronas.

### Solução

Abrir a janela do WhatsApp **antes** das operações assíncronas, e depois redirecionar para a URL correta:

```typescript
// ANTES (não funciona no iOS)
const handleFinish = async () => {
  await verificarDisponibilidade();  // async
  await criarReservas();             // async
  window.open(whatsappUrl);          // BLOQUEADO!
}

// DEPOIS (funciona no iOS)
const handleFinish = async () => {
  const win = window.open("", "_blank");  // Abre imediatamente
  
  try {
    await verificarDisponibilidade();
    await criarReservas();
    
    if (win) {
      win.location.href = whatsappUrl;  // Redireciona depois
    }
  } catch (error) {
    win?.close();  // Fecha se houver erro
  }
}
```

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/Cart.tsx` | Refatorar `handleFinish` para abrir janela antes das operações assíncronas |

### Detalhes da Implementação

1. No início de `handleFinish`, abrir uma janela/aba vazia com `window.open("", "_blank")`
2. Realizar todas as validações e criação de reservas
3. Se sucesso: redirecionar a janela para a URL do WhatsApp
4. Se erro: fechar a janela e mostrar mensagem de erro
5. Aplicar o mesmo padrão para todos os `window.open()` no arquivo

### Considerações Técnicas

- A janela ficará em branco brevemente enquanto as validações ocorrem (menos de 1 segundo normalmente)
- Se o usuário tiver bloqueador de pop-up ativo, pode precisar permitir manualmente
- Alternativa adicional: usar `window.location.href` em vez de `window.open()` se houver apenas um barbeiro (não abre nova aba, mas funciona sempre)

